import React from 'react';
import { connect } from 'react-redux';

import { numberToReadableString } from 'utils/numberUtils';

import './WalletAssetRow.scss';

function WalletAssetRow(props) {
  const { rowData, walletBalances, supplies, debts, prices } = props;
  const abbr = rowData.abbr;
  const assetValue = walletBalances[abbr] * prices[abbr];

  return (
    <div className="WalletAssetRow-container">
      <div className="WalletAssetRow-column-asset WalletAssetRow-cell">
        <img
          className="WalletAssetRow-asset-icon"
          src={rowData.image}
          alt="asset-icon"
        />
        <p className="WalletAssetRow-asset-text">{rowData.abbr}</p>
      </div>
      <div className="WalletAssetRow-column-supply-balance">
        <p className="WalletAssetRow-number">
          {numberToReadableString(supplies[abbr])}
        </p>
      </div>
      <div className="WalletAssetRow-column-borrow-balance">
        <p className="WalletAssetRow-number">
          {numberToReadableString(debts[abbr])}
        </p>
      </div>
      <div className="WalletAssetRow-column-wallet-balance">
        <p className="WalletAssetRow-number">
          {numberToReadableString(walletBalances[abbr])}
        </p>
      </div>
      <div className="WalletAssetRow-column-price">
        <p className="WalletAssetRow-number">${prices[abbr]}</p>
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
