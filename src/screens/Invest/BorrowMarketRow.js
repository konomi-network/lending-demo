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
  const { rowId, onClickBorrowMarketRow, walletBalances, prices } = props;

  const [apy, setAPY] = useState(0);
  const [liquidity, setLiquidity] = useState(0);

  // useEffect(() => {
  //   let unsubLiquidity = null;
  //   const assetId = rowId;

  //   if (assetId != null) {
  //     const getLiquidity = async () => {
  //       unsubLiquidity = await api.query.lending.pools(assetId, assetPool => {
  //         if (assetPool.isSome) {
  //           const unwrappedPool = assetPool.unwrap();
  //           const liquidityInt =
  //             balanceToUnitNumber(unwrappedPool.supply) -
  //             balanceToUnitNumber(unwrappedPool.debt);
  //           setLiquidity(liquidityInt);
  //         } else {
  //           setLiquidity(0);
  //         }
  //       });
  //     };
  //     getLiquidity();
  //   }

  //   return () => {
  //     unsubLiquidity && unsubLiquidity();
  //   };
  // }, [api.query.assets, api.query.lending, accountPair, rowId]);

  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     const rate = await api.rpc.lending.debtRate(rowId);
  //     const newAPY = fixed32ToAPY(rate);
  //     if (newAPY !== apy) {
  //       setAPY(newAPY);
  //     }
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [rowId]);

  const rowData = BORROW_ASSET_LIST[rowId];
  const abbr = rowData.abbr;
  const walletBalance = walletBalances[abbr];
  const price = prices[abbr];
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
  prices: state.market.prices,
});

export default connect(mapStateToProps)(Main);
