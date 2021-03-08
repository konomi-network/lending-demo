import React, { useEffect, useState } from 'react';

import { InvitationDialog } from '../invitation';
import { useSubstrate } from '../substrate-lib';
import AccountTotal from './AccountTotal';
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

  if (invitationActiveState !== 'Activiated') {
    return (
      <InvitationDialog />
    )
  }

  return (
    <div className="DashboardPage-container">
      <AccountTotal accountPair={accountPair} accountBalance={accountBalance} />
      <p className="DashboardPage-account-overview-header">Account Overview</p>
      <Wallet accountPair={accountPair} />
    </div>
  );
}
