import React from 'react';
import { connect } from 'react-redux';
import { formatWithDecimal, numberToReadableString } from 'utils/numberUtils';
import { COIN_IMAGES } from 'utils/coinImages';

import './SupplyMarketRow.scss';

function Main(props) {
  const { rowData, rowId, onClickSupplyMarketRow, walletBalances, decimals } =
    props;

  // const renderCollateralSlider = () => {
  //   return (
  //     <div className="SupplyMarket-collateral-column Market-table-cell">
  //       <Checkbox slider className="SupplyMarket-table-cell-slider" onChange={() => {}}/>
  //     </div>
  //   );
  // };

  const abbr = rowData.name;
  const price = formatWithDecimal(rowData.price, decimals);
  const walletBalanceCount = walletBalances[abbr] / price;

  let apy = 0;
  if (rowData && rowData.supplyAPY && rowData.supplyAPY !== '0') {
    const apyNumber = formatWithDecimal(rowData.supplyAPY, decimals) * 100;
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
        <p className="Market-table-cell-text">{`${numberToReadableString(
          walletBalanceCount
        )} ${abbr}`}</p>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  walletBalances: state.wallet.balances,
  decimals: state.market.decimals,
});

export default connect(mapStateToProps)(Main);
