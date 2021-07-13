// import { toNumber } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import { COIN_IMAGES } from 'utils/coinImages';

import { numberToReadableString, formatWithDecimal } from 'utils/numberUtils';

import './WalletAssetRow.scss';

function WalletAssetRow(props) {
  const { rowData, walletBalances, decimals } = props;

  const abbr = rowData.name;
  const price = formatWithDecimal(rowData.price, decimals);
  const supply = formatWithDecimal(rowData.supply, decimals);
  const borrow = formatWithDecimal(rowData.borrow, decimals);
  const assetValue = walletBalances[abbr] * price;

  return (
    <div className="WalletAssetRow-container">
      <div className="WalletAssetRow-column-asset WalletAssetRow-cell">
        <img
          className="WalletAssetRow-asset-icon"
          src={COIN_IMAGES[abbr]}
          alt="asset-icon"
        />
        <p className="WalletAssetRow-asset-text">{abbr}</p>
      </div>
      <div className="WalletAssetRow-column-supply-balance">
        <p className="WalletAssetRow-number">
          {numberToReadableString(supply)}
        </p>
      </div>
      <div className="WalletAssetRow-column-borrow-balance">
        <p className="WalletAssetRow-number">
          {numberToReadableString(borrow)}
        </p>
      </div>
      <div className="WalletAssetRow-column-wallet-balance">
        <p className="WalletAssetRow-number">
          {numberToReadableString(walletBalances[abbr])}
        </p>
      </div>
      <div className="WalletAssetRow-column-price">
        <p className="WalletAssetRow-number">
          ${numberToReadableString(price) || '0'}
        </p>
      </div>
      <div className="WalletAssetRow-column-value">
        <p className="WalletAssetRow-number">
          ${numberToReadableString(assetValue, true)}
        </p>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  walletBalances: state.wallet.balances,
  decimals: state.market.decimals,
});

export default connect(mapStateToProps)(WalletAssetRow);
