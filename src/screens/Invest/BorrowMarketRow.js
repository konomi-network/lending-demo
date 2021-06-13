import React, { useState } from 'react';
import { connect } from 'react-redux';

// import { useSubstrate } from 'services/substrate-lib';
import { numberToReadableString } from 'utils/numberUtils';
import DotImage from 'resources/img/DOT.png';
import EthImage from 'resources/img/ETH.png';

import './BorrowMarketRow.scss';

const BORROW_ASSET_LIST = [
  { id: 0, name: 'Polkadot', abbr: 'DOT', image: DotImage },
  { id: 1, name: 'Ethereum', abbr: 'ETH', image: EthImage },
];

function Main(props) {
  const { rowId, onClickBorrowMarketRow, walletBalances, pools, prices } =
    props;

  const rowData = BORROW_ASSET_LIST[rowId];
  const abbr = rowData.abbr;
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
          src={rowData.image}
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
