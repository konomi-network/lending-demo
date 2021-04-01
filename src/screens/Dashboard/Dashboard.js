import React from 'react';

import { Hint } from 'components';
import { ReactComponent as HealthCircleSVG } from 'resources/icons/HealthCircle.svg';
import { numberToReadableString } from 'utils/numberUtils';
import { useWallet } from './WalletContext';
import './Dashboard.scss';

const EXPLAINATION = {
  healthIndex: "Liquidation will be triggered when the total supply is lower than the total borrowed, health index is calculated by converted supply divide converted borrow",
  borrowLimit: "The maximum amount you can borrow"
}

const COLOR = {
  blue: "#20EFEF",
  orange: "#F18B14",
  pink: "#CF1891"
}

const getHealthIndexColor = (healthIndex) => {
  if (healthIndex >= 2) {
    return COLOR.blue;
  } else if (healthIndex >= 1) {
    return COLOR.orange;
  } else if (healthIndex >= 0){
    return COLOR.pink;
  } else {
    return COLOR.blue;
  }
}

const getHealthIndexText = (healthIndex) => {
  if (healthIndex >= 10) {
    return "10.0+";
  } else if (healthIndex >= 0.1) {
    return healthIndex.toFixed(1);
  } else if (healthIndex === 0) {
    return "0.0";
  } else if (healthIndex < 0) {
    return "NA"
  }{
    return "<1";
  }
}

const HealthCircle = ({ healthIndex }) => {
  if (healthIndex > 2.0 || healthIndex < 0) {
    return (
      <HealthCircleSVG stroke={COLOR.blue} />
    );
  } else if (healthIndex > 1.0) {
    return (
      <HealthCircleSVG stroke={COLOR.orange}/>
    )
  }
  return (
    <HealthCircleSVG stroke={COLOR.pink} />
  )
}


export default function Main (props) {
  const { accountBalance } = props;
  const { prices, setPrices, balances, setBalances} = useWallet();

  let result = 0;
  for (let index = 0; index < 5; index++) {
    result += prices[index] * balances[index];
  }

  const getHealthIndex = () => {
    if (!accountBalance || accountBalance.debtBalance === 0 || accountBalance.borrowLimit === 0) {
      return -1;
    }
    const index = accountBalance.borrowLimit / accountBalance.debtBalance;
    if (isNaN(index)) {
      return -1;
    }
    return index;
  }

  const healthIndex = getHealthIndex();

  const getHealthIndexStyle = () => {
    const color = getHealthIndexColor(healthIndex)
    if (healthIndex >= 10) {
      return {
        color,
        fontSize: 50,
        left: 95
      };
    }
    return { color };
  }

  return (
    <div className="Dashboard-container">
      <div className="Dashboard-item Dashboard-supply">
        <p className="Dashboard-cell-label">TOTAL SUPPLY</p>
        <p className="Dashboard-cell-number">
          ${numberToReadableString(accountBalance.supplyBalance, true)}
        </p>
      </div>
      <div className="Dashboard-item Dashboard-borrow">
        <p className="Dashboard-cell-label">TOTAL BORROW</p>
        <p className="Dashboard-cell-number">
          ${numberToReadableString(accountBalance.debtBalance, true)}
        </p>
      </div>
      <div className="Dashboard-item Dashboard-health">
        <p className="Dashboard-cell-label">HEALTH INDEX <Hint text={EXPLAINATION.healthIndex} /></p>
        <div className="Dashboard-health-circle">
          <HealthCircle healthIndex={healthIndex} />
        </div>
        <p className="Dashboard-health-index" style={getHealthIndexStyle()}>
          {getHealthIndexText(healthIndex)}
        </p>
        <p className="Dashboard-health-threshold">
          LIQUIDATION THRESHOLD: 1.0
        </p>
      </div>
      <div className="Dashboard-item Dashboard-borrow-limit">
        <p className="Dashboard-cell-label">Borrow Limit <Hint text={EXPLAINATION.borrowLimit}/></p>
        <p className="Dashboard-cell-number">
          ${numberToReadableString(accountBalance.borrowLimit, true)}
        </p>
      </div>
      <div className="Dashboard-item Dashboard-apy">
        <p className="Dashboard-cell-label">TOTAL WALLET BALLANCE</p>
        <p className="Dashboard-cell-number">
          ${numberToReadableString(result, true)}
        </p>
      </div>
    </div>
  );
}
