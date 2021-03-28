import React from 'react';

import './LiquidationAlert.scss';

export default function Main (props) {
  const { accountPair, accountBalance, liquidationThreshold } = props;

  if (!accountPair || !accountPair.address) {
    return null;
  }

  if (accountBalance.borrowLimit == null ||
      accountBalance.debtBalance == null ||
      liquidationThreshold == null) {
    return null;
  }

  if (accountBalance.debtBalance > accountBalance.borrowLimit / liquidationThreshold) {
    return (
      <div className="LiquidationAlert-container">
        <p className="LiquidationAlert-warning-text">
          Warning. Your account is being liquidated. Please repay as soon as possible.
        </p>
      </div>
    );
  }
}
