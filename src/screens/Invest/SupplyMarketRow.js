import React from 'react';
import { connect } from 'react-redux';
import { COIN_IMAGES } from 'utils/coinImages';

import './SupplyMarketRow.scss';

function Main(props) {
  const { rowId, onClickSupplyMarketRow, walletBalances, pools } = props;

  // const renderCollateralSlider = () => {
  //   return (
  //     <div className="SupplyMarket-collateral-column Market-table-cell">
  //       <Checkbox slider className="SupplyMarket-table-cell-slider" onChange={() => {}}/>
  //     </div>
  //   );
  // };

  const rowData = pools[rowId];
  const abbr = rowData.name;
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
          src={COIN_IMAGES[abbr]}
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
