import React, { useEffect, useState } from 'react';

import AccountTotal from './AccountTotal';
import Wallet from './Wallet';
import './DashboardPage.css';

export default function Main (props) {
  const { accountPair } = props;

  return (
    <div className="DashboardPage-container">
      <AccountTotal accountPair={accountPair} />
      <p className="DashboardPage-account-overview-header">Account Overview</p>
      <Wallet accountPair={accountPair} />
    </div>
  );
}
