import React, { useState } from 'react';
import { connect } from 'react-redux';

// import { useSubstrate } from 'services/substrate-lib';
import { numberToReadableString } from 'utils/numberUtils';
import { COIN_IMAGES } from 'utils/coinImages';
import './BorrowMarketRow.scss';

function Main(props) {
  const { rowId, onClickBorrowMarketRow, walletBalances, pools, prices } =
    props;

  const rowData = pools[rowId];
  const abbr = rowData.name;
  const walletBalance = walletBalances[abbr];
  const price = prices[abbr];
  const pool = pools[abbr];
  let apy = 0;
  if (pool && pool.borrowAPY && pool.borrowAPY !== '0') {
    const apyNumber = parseInt(pool.borrowAPY) / 100000;
    apy = apyNumber.toFixed(2);
  }
  let liquidity = 0;
  if (pool && pool.supply && pool.supply !== '0') {
    liquidity = parseInt(pool.supply) / 100000;
  }
  return (
    <div
      className="Market-table-row"
      key={`borrow ${rowId}`}
      onClick={() => onClickBorrowMarketRow(rowId)}
    >
      <div className="BorrowMarket-asset-column Market-table-cell">
        <img
          className="Market-asset-icon"
          src={COIN_IMAGES[abbr]}
          alt="asset-icon"
        />
        <p className="Market-table-asset-text">{abbr}</p>
      </div>
      <div className="BorrowMarket-apy-column">
        <p className="Market-table-cell-text">{apy}%</p>
      </div>
      <div className="BorrowMarket-wallet-column">
        <p className="Market-table-cell-text">{`${walletBalance} ${abbr}`}</p>
      </div>
      <div className="BorrowMarket-liquidity-column">
        <p className="Market-table-cell-text">
          ${numberToReadableString(liquidity * price, true)}
        </p>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  walletBalances: state.wallet.balances,
  pools: state.market.pools,
  prices: state.market.prices,
});

export default connect(mapStateToProps)(Main);
