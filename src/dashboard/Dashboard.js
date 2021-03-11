import React, { useEffect, useState } from 'react';

import { numberToReadableString } from '../numberUtils';

import './Dashboard.css';

export default function Main (props) {
  const { accountBalance } = props;

  const renderHealthCircle = (healthIndex) => {
    if (healthIndex > 2.0) {
      return (
        <svg width="274" height="274" viewBox="0 0 274 274" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M201.467 200.356C236.306 164.904 235.809 107.921 200.357 73.0819C164.904 38.2427 107.921 38.74 73.0822 74.1926C38.2431 109.645 38.7403 166.628 74.1929 201.467" stroke="#20EFEF" stroke-width="13" stroke-linecap="round"/>
        </svg>
      );
    }
    if (healthIndex > 1.0) {
      return (
        <svg width="274" height="274" viewBox="0 0 274 274" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M201.467 200.356C236.306 164.904 235.809 107.921 200.357 73.0819C164.904 38.2427 107.921 38.74 73.0822 74.1926C38.2431 109.645 38.7403 166.628 74.1929 201.467" stroke="#F18B14" stroke-width="13" stroke-linecap="round"/>
        </svg>
      )
    }
    return (
      <svg width="274" height="274" viewBox="0 0 274 274" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M201.467 200.356C236.306 164.904 235.809 107.921 200.357 73.0819C164.904 38.2427 107.921 38.74 73.0822 74.1926C38.2431 109.645 38.7403 166.628 74.1929 201.467" stroke="#CF1891" stroke-width="13" stroke-linecap="round"/>
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
          {renderHealthCircle(2.3)}
        </div>
        <p className="Dashboard-health-index">
          2.3
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
        <p className="Dashboard-cell-label">AGGREGATED SUPPLY APY</p>
        <p className="Dashboard-cell-number">
          8.5%
        </p>
      </div>
    </div>
  );
}
