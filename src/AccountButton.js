import React, { useState, useEffect } from 'react';
import { Dropdown } from 'semantic-ui-react';
import { useCookies, Cookies } from 'react-cookie';

import { useSubstrate } from './substrate-lib';
import './AccountButton.css';

function Main (props) {
  const { keyring } = useSubstrate();
  const { setAccountAddress } = props;
  const [accountSelected, setAccountSelected] = useState('');

  // Get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map(account => {
    const shortAddress = account.address.slice(0,6) + "..." + account.address.slice(-4);
    return {
      key: account.address,
      value: account.address,
      text: `${account.meta.name.toUpperCase()}    ${shortAddress}`
    };
  });

  const initialAddress =
    keyringOptions.length > 0 ? keyringOptions[0].value : '';

  // Set the initial address
  useEffect(() => {
    setAccountAddress(initialAddress);
    setAccountSelected(initialAddress);
  }, [setAccountAddress, initialAddress]);

  const onChange = address => {
    // Update state with new account address
    setAccountAddress(address);
    setAccountSelected(address);
  };

  return (
    <div style={{ width: '400px', paddingTop: '10px' }}>
      <Dropdown
        basic
        selection
        fluid
        placeholder='Account'
        options={keyringOptions}
        onChange={(_, dropdown) => {
          onChange(dropdown.value);
        }}
        value={accountSelected}
      />
    </div>
  );
}

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
    return (<Main {...props} />);
  } else if (cookies.konomiLoggedIn) {
    console.log(cookies.konomiLoggedIn);
    loadAccounts();
    return null;
  } else {
    return (<ConnectAccountButton{...props} setCookie={setCookie} />);
  }
}
