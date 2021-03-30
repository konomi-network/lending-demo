import React from 'react';

import AccountButton from 'components/Account/AccountButton';
import './WelcomePage.scss';

export default function Main (props) {
  const { setAccountAddress } = props;
  return (
    <div className="WelcomePage-container">
      <p className="WelcomePage-hint">Please connect to your wallet to start</p>
      <AccountButton setAccountAddress={setAccountAddress}/>
    </div>
  );
}
