import React from 'react';

import { InvitationDialog, LiquidationAlert } from 'components';
import { useSubstrate } from 'services/substrate-lib';
import Dashboard from './Dashboard';
import Wallet from './Wallet';

import './DashboardPage.scss';

export default function Main(props) {
  const { accountPair } = props;
  const { invitationActiveState } = useSubstrate();

  if (!accountPair || !accountPair.address) {
    return null;
  }

  if (invitationActiveState !== 'Activated') {
    return <InvitationDialog />;
  }

  return (
    <div className="DashboardPage-container">
      <LiquidationAlert {...props} />
      <Dashboard {...props} />
      <Wallet {...props} />
    </div>
  );
}
