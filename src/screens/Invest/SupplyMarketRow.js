import React, { useState } from 'react';
import { connect } from 'react-redux';

import DotImage from 'resources/img/DOT.png';
import EthImage from 'resources/img/ETH.png';

import './SupplyMarketRow.scss';

const SUPPLY_ASSET_LIST = [
  {
    id: 0,
    name: 'Polkadot',
    abbr: 'DOT',
    image: DotImage,
    apy: 0.0204,
    price: 60,
  },
  {
    id: 1,
    name: 'Ethereum',
    abbr: 'ETH',
    image: EthImage,
    apy: 0.0004,
    price: 600,
  },
];

function Main(props) {
  const { rowId, onClickSupplyMarketRow, walletBalances, pools } = props;

  // const renderCollateralSlider = () => {
  //   return (
  //     <div className="SupplyMarket-collateral-column Market-table-cell">
  //       <Checkbox slider className="SupplyMarket-table-cell-slider" onChange={() => {}}/>
  //     </div>
  //   );
  // };

  const rowData = SUPPLY_ASSET_LIST[rowId];
  const abbr = rowData.abbr;
  const walletBalance = walletBalances[abbr];
  const pool = pools[abbr];
  let apy = 0;
  if (pool && pool.supplyAPY && pool.supplyAPY !== '0') {
    const apyNumber = parseInt(pool.supplyAPY) / 100000;
    apy = apyNumber.toFixed(2);
  }
  return (
    <div
      className="Market-table-row"
      key={`supply ${rowId}`}
      onClick={() => onClickSupplyMarketRow(rowId)}
    >
      <div className="SupplyMarket-asset-column Market-table-cell">
        <img
          className="Market-asset-icon"
          src={rowData.image}
          alt="asset-icon"
        />
        <p className="Market-table-asset-text">{abbr}</p>
      </div>
      <div className="SupplyMarket-apy-column">
        <p className="Market-table-cell-text">{apy}%</p>
      </div>
      <div className="SupplyMarket-wallet-column">
        <p className="Market-table-cell-text">{`${walletBalance} ${abbr}`}</p>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  walletBalances: state.wallet.balances,
  pools: state.market.pools,
});

export default connect(mapStateToProps)(Main);
