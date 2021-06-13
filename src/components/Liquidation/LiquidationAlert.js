import React from 'react';
import { connect } from 'react-redux';

import './LiquidationAlert.scss';

function Main(props) {
  const { accountPair, debts, supplies, prices, liquidationThreshold } = props;

  if (!accountPair || !accountPair.address) {
    return null;
  }

  if (liquidationThreshold == null) {
    return null;
  }

  let totalSupplyBalance = 0;
  totalSupplyBalance =
    prices['DOT'] * supplies['DOT'] + prices['ETH'] * supplies['ETH'];

  let totalDebtBalance = 0;
  totalDebtBalance =
    prices['DOT'] * debts['DOT'] + prices['ETH'] * debts['ETH'];

  if (totalDebtBalance > totalSupplyBalance / liquidationThreshold) {
    return (
      <div className="LiquidationAlert-container">
        <p className="LiquidationAlert-warning-text">
          Warning. Your account is being liquidated. Please repay as soon as
          possible.
        </p>
      </div>
    );
  }

  return null;
}

const mapStateToProps = state => ({
  debts: state.market.debts,
  supplies: state.market.supplies,
  prices: state.market.prices,
  liquidationThreshold: state.market.liquidationThreshold,
});

export default connect(mapStateToProps)(Main);
