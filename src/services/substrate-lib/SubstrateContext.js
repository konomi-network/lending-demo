import React, { useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';
import queryString from 'query-string';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp';
import keyring from '@polkadot/ui-keyring';

import config from '../../config';

const parsedQuery = queryString.parse(window.location.search);
const connectedSocket = parsedQuery.rpc || config.PROVIDER_SOCKET;

///
// Initial state for `useReducer`

const INIT_STATE = {
  socket: connectedSocket,
  jsonrpc: { ...jsonrpc, ...config.RPC },
  types: config.CUSTOM_TYPES,
  keyring: null,
  keyringState: null,
  api: null,
  apiError: null,
  apiState: null,
  invitationActiveState: 'Activated',
  invitationVerificationMessage: null,
  invitationActivationMessage: null,
};

///
// Reducer function for `useReducer`

const reducer = (state, action) => {
  switch (action.type) {
    case 'CONNECT_INIT':
      return { ...state, apiState: 'CONNECT_INIT' };

    case 'CONNECT':
      return { ...state, api: action.payload, apiState: 'CONNECTING' };

    case 'CONNECT_SUCCESS':
      return { ...state, apiState: 'READY' };

    case 'CONNECT_ERROR':
      return { ...state, apiState: 'ERROR', apiError: action.payload };

    case 'LOAD_KEYRING':
      return { ...state, keyringState: 'LOADING' };

    case 'SET_KEYRING':
      return { ...state, keyring: action.payload, keyringState: 'READY' };

    case 'KEYRING_ERROR':
      return { ...state, keyring: null, keyringState: 'ERROR' };

    case 'INVITATION_VERIFIED':
      return { ...state, invitationActiveState: 'Activated', invitationVerificationMessage: null, invitationActivationMessage: null };

    case 'INVITATION_VERIFICATION_FAIL':
      return { ...state, invitationActiveState: 'Verification_failed', invitationVerificationMessage: action.payload };
    
    case 'INVITATION_VERIFICATION_ERROR':
      return { ...state, invitationActiveState: 'Verification_error' };

    case 'INVITATION_ACTIVATION_FAIL':
      return {...state, invitationActiveState: 'Activation_failed', invitationActivationMessage: action.payload};

    case 'INVITATION_ACTIVATION_ERROR':
      return {...state, invitationActiveState: 'Activation_error'};

    default:
      throw new Error(`Unknown type: ${action.type}`);
  }
};

///
// Connecting to the Substrate node

const connect = (state, dispatch) => {
  const { apiState, socket, jsonrpc, types } = state;
  // We only want this function to be performed once
  if (apiState) return;

  dispatch({ type: 'CONNECT_INIT' });

  const provider = new WsProvider(socket);
  const _api = new ApiPromise({ provider, types, rpc: jsonrpc });

  // Set listeners for disconnection and reconnection event.
  _api.on('connected', () => {
    dispatch({ type: 'CONNECT', payload: _api });
    // `ready` event is not emitted upon reconnection and is checked explicitly here.
    _api.isReady.then((_api) => dispatch({ type: 'CONNECT_SUCCESS' }));
  });
  _api.on('ready', () => dispatch({ type: 'CONNECT_SUCCESS' }));
  _api.on('error', err => dispatch({ type: 'CONNECT_ERROR', payload: err }));
};

///
// Loading accounts from dev and polkadot-js extension

let loadAccts = false;
const loadAccounts = (state, dispatch) => {
  const asyncLoadAccounts = async () => {
    dispatch({ type: 'LOAD_KEYRING' });
    try {
      await web3Enable(config.APP_NAME);
      let allAccounts = await web3Accounts();
      // allAccounts = allAccounts.map(({ address, meta }) =>
      //   ({ address, meta: { ...meta, name: `${meta.name} (${meta.source})` } }));
      allAccounts = allAccounts.map(({ address, meta }) =>
        ({ address, meta: { ...meta } }));
      console.log(allAccounts);
      keyring.loadAll({ isDevelopment: config.DEVELOPMENT_KEYRING }, allAccounts);
      dispatch({ type: 'SET_KEYRING', payload: keyring });
      console.log(keyring);
    } catch (e) {
      console.error(e);
      dispatch({ type: 'KEYRING_ERROR' });
    }
  };

  const { keyringState } = state;
  // If `keyringState` is not null `asyncLoadAccounts` is running.
  if (keyringState) return;
  // If `loadAccts` is true, the `asyncLoadAccounts` has been run once.
  if (loadAccts) return dispatch({ type: 'SET_KEYRING', payload: keyring });

  // This is the heavy duty work
  loadAccts = true;
  asyncLoadAccounts();
};

const verifyInvitation = (state, dispatch, addressList) => {
  const asyncVerify = async (accountAddressList) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletIds: accountAddressList }),
      redirect: 'follow'
    };
    console.log('address');
    console.log(accountAddressList);
    await fetch('https://app.konomi.tech/code/login', requestOptions)
      .then(response => {
        const asyncHandleResponse = async () => {
          const data = await response.json();
          if (response.status == 200 && response.ok) {
            dispatch({ type: 'INVITATION_VERIFIED' });
          } else {
            dispatch({ type: 'INVITATION_VERIFICATION_FAIL', payload:data.message });
          }
        }
        asyncHandleResponse();
      })
      .catch(error => {
        console.log('error', error)
        dispatch({ type: 'INVITATION_VERIFICATION_ERROR' });
      });
  }
  asyncVerify(addressList);
}

const activateInvitation = (state, dispatch, addressList, code) => {
  const asyncActivate = async (accountAddressList, code) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ walletIds: accountAddressList, code }),
      redirect: 'follow'
    };
    await fetch('https://app.konomi.tech/code/activate', requestOptions)
      .then(response => {
        const asyncHandleResponse = async () => {
          const data = await response.json();
          if (response.status == 200 && response.ok) {
            dispatch({ type: 'INVITATION_VERIFIED' });
          } else {
            dispatch({ type: 'INVITATION_ACTIVATION_FAIL', payload:data.message });
          }
        }
        asyncHandleResponse();
      })
      .catch(error => {
        console.log('error', error)
        dispatch({ type: 'INVITATION_ACTIVATION_ERROR' });
      });
  }
  asyncActivate(addressList, code);
}

const SubstrateContext = React.createContext();

const SubstrateContextProvider = (props) => {
  // filtering props and merge with default param value
  const initState = { ...INIT_STATE };
  const neededPropNames = ['socket', 'types'];
  neededPropNames.forEach(key => {
    initState[key] = (typeof props[key] === 'undefined' ? initState[key] : props[key]);
  });

  const [state, dispatch] = useReducer(reducer, initState);
  connect(state, dispatch);
  state.loadAccounts = () => {
    console.log('loadAccounts');
    loadAccounts(state, dispatch);
  };
  // loadAccounts(state, dispatch);
  state.verifyInvitation = (accountAddressList) => {
    verifyInvitation(state, dispatch, accountAddressList);
  }

  state.activateInvitation = (accountAddressList, code) => {
    activateInvitation(state, dispatch, accountAddressList, code);
  }

  return <SubstrateContext.Provider value={state}>
    {props.children}
  </SubstrateContext.Provider>;
};

// prop typechecking
SubstrateContextProvider.propTypes = {
  socket: PropTypes.string,
  types: PropTypes.object
};

const useSubstrate = () => ({ ...useContext(SubstrateContext) });

export { SubstrateContextProvider, useSubstrate };
