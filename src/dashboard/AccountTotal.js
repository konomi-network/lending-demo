import React, { useEffect, useState } from 'react';

import { useSubstrate } from '../substrate-lib';
import { balanceToUnitNumber, numberToReadableString } from '../numberUtils';

import './AccountTotal.css';

const moneyBase = 1000000000000;

const INIT_ACCOUNT_BALANCE = {
  borrowLimit: 0,
  supplyBalance: 0,
  debtBalance: 0
};

export default function Main (props) {
  const { accountPair } = props;

  const [accountBalance, setAccountBalance] = useState(INIT_ACCOUNT_BALANCE);

  const { api } = useSubstrate();

  useEffect(() => {
    let unsubUser = null;

    if (accountPair) {
      const getAccountBalance = async () => {
        unsubUser = await api.query.lending.users(accountPair.address, userData => {
          if (userData.isSome) {
            const dataUnwrap = userData.unwrap();
            const borrowLimit = dataUnwrap.borrowLimit
              ? balanceToUnitNumber(dataUnwrap.borrowLimit) : 0;
            const supplyBalance = dataUnwrap.supplyBalance
              ? balanceToUnitNumber(dataUnwrap.supplyBalance) : 0;
            const debtBalance = dataUnwrap.debtBalance
              ? balanceToUnitNumber(dataUnwrap.debtBalance) : 0;
            setAccountBalance({ borrowLimit, supplyBalance, debtBalance });
          } else {
            setAccountBalance(INIT_ACCOUNT_BALANCE);
          }
        });
      };
      getAccountBalance();
    }

    return () => unsubUser && unsubUser();
  }, [api.query.lending, accountPair]);

  return (
    <div className="AccountTotal-container">
      <div className="AccountTotal-cell">
        <p className="AccountTotal-cell-label">Total Supply</p>
        <p className="AccountTotal-cell-number">
          ${numberToReadableString(accountBalance.supplyBalance)}
        </p>
      </div>
      <div className="AccountTotal-divider">
      </div>
      <div className="AccountTotal-cell">
        <p className="AccountTotal-cell-label">Total Borrow</p>
        <p className="AccountTotal-cell-number">
          ${numberToReadableString(accountBalance.debtBalance)}
        </p>
      </div>
      <div className="AccountTotal-divider">
      </div>
      <div className="AccountTotal-cell">
        <p className="AccountTotal-cell-label">Borrow Limit</p>
        <p className="AccountTotal-cell-number">
          ${numberToReadableString(accountBalance.borrowLimit)}
        </p>
      </div>
    </div>
  );
}
