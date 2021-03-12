import React, { useEffect, useState } from 'react';

import { InvitationDialog } from '../invitation';
import { useSubstrate } from '../substrate-lib';
import AccountTotal from './AccountTotal';
import Dashboard from './Dashboard';
import Wallet from './Wallet';
import './DashboardPage.css';

export default function Main (props) {
  const { accountPair, accountBalance } = props;
  const { invitationActiveState } = useSubstrate();

  if (!accountPair || !accountPair.address) {
    return (
      <h1 style={{marginLeft: "25px", marginTop: "40px"}}>Please connect to your wallet first.</h1>
    );
  }

  if (invitationActiveState !== 'Activated') {
    return (
      <InvitationDialog />
    )
  }

  return (
    <div className="DashboardPage-container">
      <Dashboard accountPair={accountPair} accountBalance={accountBalance} />
      <Wallet accountPair={accountPair} />
    </div>
  );
}
