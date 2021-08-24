import React from 'react';

import { InvitationDialog, LiquidationAlert } from 'components';
import { useSubstrate } from 'services/substrate-lib';
import Dashboard from './Dashboard';
import Wallet from './Wallet';

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
    <div>
      <LiquidationAlert {...props} />
      <Dashboard {...props} />
      <Wallet {...props} />
    </div>
  );
}
