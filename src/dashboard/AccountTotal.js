import React, { useEffect, useState } from 'react';

import { balanceToUnitNumber, numberToReadableString } from '../numberUtils';
import { useSubstrate } from '../substrate-lib';

import './AccountTotal.css';


const INIT_ACCOUNT_BALANCE = {
  borrowLimit: 0,
  supplyBalance: 0,
  debtBalance: 0
};

export default function Main (props) {
  const { accountPair, accountBalance } = props;

  const { api } = useSubstrate();

  return (
    <div className="AccountTotal-container">
      <div className="AccountTotal-cell">
        <p className="AccountTotal-cell-label">Total Supply</p>
        <p className="AccountTotal-cell-number">
          ${numberToReadableString(accountBalance.supplyBalance, true)}
        </p>
      </div>
      <div className="AccountTotal-divider">
      </div>
      <div className="AccountTotal-cell">
        <p className="AccountTotal-cell-label">Total Borrow</p>
        <p className="AccountTotal-cell-number">
          ${numberToReadableString(accountBalance.debtBalance, true)}
        </p>
      </div>
      <div className="AccountTotal-divider">
      </div>
      <div className="AccountTotal-cell">
        <p className="AccountTotal-cell-label">Borrow Limit</p>
        <p className="AccountTotal-cell-number">
          ${numberToReadableString(accountBalance.borrowLimit, true)}
        </p>
      </div>
    </div>
  );
}
