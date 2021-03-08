import React, { useState, useEffect } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { useCookies, Cookies } from 'react-cookie';

import { useSubstrate } from './substrate-lib';
import AccountSelector from './AccountSelector';
import './AccountButton.css';

function ConnectAccountButton (props) {
  const { loadAccounts } = useSubstrate();
  const { setCookie } = props;
  const onClickConnectButton = () => {
    loadAccounts();
    setCookie('konomiLoggedIn', true, {maxAge: 3600});
  };
  return (
    <button
      className="ConnectAccountButton"
      onClick={onClickConnectButton}>
      Connect To Wallet
    </button>
  )
}

export default function AccountButton (props) {
  const { api, keyring, loadAccounts } = useSubstrate();
  const [cookies, setCookie] = useCookies(['konomiLoggedIn']);
  if (keyring && keyring.getPairs && api && api.query) {
    // Already logged in, show selector.
    return (<AccountSelector {...props} />)
  } else if (cookies.konomiLoggedIn) {
    // Connected before, load account and wait for re-render.
    loadAccounts();
    return null;
  } else {
    // Never connected before or cookie expires. Show connect button.
    return (<ConnectAccountButton{...props} setCookie={setCookie} />);
  }
}
