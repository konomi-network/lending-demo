import React, { useEffect, useState } from 'react';

import { numberToReadableString } from '../numberUtils';

import './WalletAssetRow.css';

export default function Main (props) {
  const { rowData } = props;

  const assetValue = rowData.price * rowData.balance;

  return (
    <div className="WalletAssetRow-container">
      <div className="WalletAssetRow-column-asset WalletAssetRow-cell">
        <img className="WalletAssetRow-asset-icon" src={rowData.image} alt="asset-icon" />
        <p className="WalletAssetRow-asset-text">{rowData.abbr}</p>
      </div>
      <div className="WalletAssetRow-column-balance">
        <p className="WalletAssetRow-number">{numberToReadableString(rowData.balance)}</p>
      </div>
      <div className="WalletAssetRow-column-price">
        <p className="WalletAssetRow-number">${rowData.price}</p>
      </div>
      <div className="WalletAssetRow-column-value">
        <p className="WalletAssetRow-number">${numberToReadableString(assetValue)}</p>
      </div>
    </div>
  );
}
