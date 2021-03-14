import React, { useEffect, useState } from 'react';

import { numberToReadableString } from '../numberUtils';
import { useWallet } from './WalletContext';
import './Dashboard.css';

export default function Main (props) {
  const { accountBalance } = props;
  const { prices, setPrices, balances, setBalances} = useWallet();

  let result = 0;
  for (let index = 0; index < 5; index++) {
    result += prices[index] * balances[index];
  }

  const getHealthIndex = () => {
    if (!accountBalance || accountBalance.debtBalance == 0 || accountBalance.borrowLimit == 0) {
      return -1;
    }
    const index = accountBalance.borrowLimit / accountBalance.debtBalance;
    if (isNaN(index)) {
      return -1;
    }
    return index;
  }

  const getHealthIndexText = () => {
    const indexNumber = getHealthIndex();
    if (indexNumber >= 10) {
      return "10.0+";
    } else if (indexNumber >= 0.1) {
      return indexNumber.toFixed(1);
    } else if (indexNumber == 0) {
      return "0.0";
    } else if (indexNumber < 0) {
      return "NA"
    }{
      return "<1";
    }
  }

  const getHealthIndexStyle = () => {
    const indexNumber = getHealthIndex();
    if (indexNumber >= 10) {
      return {
        'color': getHealthIndexColor(),
        'font-size': '50px',
        'left': '95px',
      };
    }
    return {color: getHealthIndexColor()};
  }

  const getHealthIndexColor = () => {
    const indexNumber = getHealthIndex();
    if (indexNumber >= 2) {
      return "#37BCEC";
    } else if (indexNumber >= 1) {
      return "#F18B14";
    } else if (indexNumber >= 0){
      return "#CF1891";
    } else {
      return "#37BCEC";
    }
  }

  const renderHealthCircle = () => {
    const healthIndex = getHealthIndex();
    if (healthIndex > 2.0 || healthIndex < 0) {
      return (
        <svg width="274" height="274" viewBox="0 0 274 274" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M201.467 200.356C236.306 164.904 235.809 107.921 200.357 73.0819C164.904 38.2427 107.921 38.74 73.0822 74.1926C38.2431 109.645 38.7403 166.628 74.1929 201.467" stroke="#20EFEF" strokeWidth="13" stroke-linecap="round"/>
        </svg>
      );
    }
    if (healthIndex > 1.0) {
      return (
        <svg width="274" height="274" viewBox="0 0 274 274" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M201.467 200.356C236.306 164.904 235.809 107.921 200.357 73.0819C164.904 38.2427 107.921 38.74 73.0822 74.1926C38.2431 109.645 38.7403 166.628 74.1929 201.467" stroke="#F18B14" strokeWidth="13" stroke-linecap="round"/>
        </svg>
      )
    }
    return (
      <svg width="274" height="274" viewBox="0 0 274 274" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M201.467 200.356C236.306 164.904 235.809 107.921 200.357 73.0819C164.904 38.2427 107.921 38.74 73.0822 74.1926C38.2431 109.645 38.7403 166.628 74.1929 201.467" stroke="#CF1891" strokeWidth="13" stroke-linecap="round"/>
      </svg>
    )
  }

  return (
    <div className="Dashboard-container">
      <div className="Dashboard-item Dashboard-supply">
        <p className="Dashboard-cell-label">TOTAL SUPPLY</p>
        <p className="Dashboard-cell-number">
          ${numberToReadableString(accountBalance.supplyBalance, true)}
        </p>
      </div>
      <div className="Dashboard-item Dashboard-borrow">
        <p className="Dashboard-cell-label">TOTAL BORROW</p>
        <p className="Dashboard-cell-number">
          ${numberToReadableString(accountBalance.debtBalance, true)}
        </p>
      </div>
      <div className="Dashboard-item Dashboard-health">
        <p className="Dashboard-cell-label">HEALTH INDEX</p>
        <div className="Dashboard-health-circle">
          {renderHealthCircle()}
        </div>
        <p className="Dashboard-health-index" style={getHealthIndexStyle()}>
          {getHealthIndexText()}
        </p>
        <p className="Dashboard-health-threshold">
          LIQUIDATION THRESHOLD: 1.0
        </p>
      </div>
      <div className="Dashboard-item Dashboard-borrow-limit">
        <p className="Dashboard-cell-label">Borrow Limit</p>
        <p className="Dashboard-cell-number">
          ${numberToReadableString(accountBalance.borrowLimit, true)}
        </p>
      </div>
      <div className="Dashboard-item Dashboard-apy">
        <p className="Dashboard-cell-label">TOTAL WALLET BALLANCE</p>
        <p className="Dashboard-cell-number">
          ${numberToReadableString(result, true)}
        </p>
      </div>
    </div>
  );
}
