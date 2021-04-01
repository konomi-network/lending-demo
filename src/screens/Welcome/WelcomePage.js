import React from 'react';

import AccountButton from 'components/Account/AccountButton';
import styles from  './WelcomePage.module.scss';

export default function Main (props) {
  const { setAccountAddress } = props;
  return (
    <div className={styles.container}>
      <p className={styles.hint}>Please connect to your wallet to start</p>
      <AccountButton setAccountAddress={setAccountAddress}/>
    </div>
  );
}
