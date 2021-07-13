import { toNumber } from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import { COIN_IMAGES } from 'utils/coinImages';

import { numberToReadableString } from 'utils/numberUtils';

import './WalletAssetRow.scss';

function WalletAssetRow(props) {
  const { rowData, walletBalances } = props;

  const abbr = rowData.name;
  const assetValue = walletBalances[abbr] * toNumber(rowData.price);

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
          {numberToReadableString(rowData.supply)}
        </p>
      </div>
      <div className="WalletAssetRow-column-borrow-balance">
        <p className="WalletAssetRow-number">
          {numberToReadableString(rowData.borrow)}
        </p>
      </div>
      <div className="WalletAssetRow-column-wallet-balance">
        <p className="WalletAssetRow-number">
          {numberToReadableString(walletBalances[abbr])}
        </p>
      </div>
      <div className="WalletAssetRow-column-price">
        <p className="WalletAssetRow-number">
          ${numberToReadableString(rowData.price) || '0'}
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
  debts: state.market.debts,
  supplies: state.market.supplies,
  prices: state.market.prices,
});

export default connect(mapStateToProps)(WalletAssetRow);
