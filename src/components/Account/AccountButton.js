import React from 'react';
import { useCookies } from 'react-cookie';

import { useSubstrate } from 'services/substrate-lib';
import AccountSelector from './AccountSelector';
import styles from './AccountButton.module.scss';

function ConnectAccountButton (props) {
  const { loadAccounts } = useSubstrate();
  const { setCookie } = props;
  const onClickConnectButton = () => {
    loadAccounts();
    setCookie('konomiLoggedIn', true, {maxAge: 3600});
  };
  return (
    <button
      className={styles.connectAccountButton}
      onClick={onClickConnectButton}>
      Connect To Wallet
    </button>
  )
}

export default function AccountButton (props) {
  const { keyring, loadAccounts } = useSubstrate();
  const [cookies, setCookie] = useCookies(['konomiLoggedIn']);
  if (keyring && keyring.getPairs) {
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
