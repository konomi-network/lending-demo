import React from 'react';

import { Hint } from 'components';
import { ReactComponent as HealthCircleSVG } from 'resources/icons/HealthCircle.svg';
import { numberToReadableString } from 'utils/numberUtils';
import { useWallet } from './WalletContext';

import styles from './Dashboard.module.scss';

const EXPLAINATION = {
  healthIndex:
    'Liquidation will be triggered when the total supply is lower than the total borrowed, health index is calculated by converted supply divide converted borrow',
  borrowLimit: 'The maximum amount you can borrow',
};

const COLOR = {
  blue: '#20EFEF',
  orange: '#F18B14',
  pink: '#CF1891',
};

const getHealthIndexColor = healthIndex => {
  if (healthIndex >= 2) {
    return COLOR.blue;
  } else if (healthIndex >= 1) {
    return COLOR.orange;
  } else if (healthIndex >= 0) {
    return COLOR.pink;
  } else {
    return COLOR.blue;
  }
};

const getHealthIndexText = healthIndex => {
  if (healthIndex >= 10) {
    return '10.0+';
  } else if (healthIndex >= 0.1) {
    return healthIndex.toFixed(1);
  } else if (healthIndex === 0) {
    return '0.0';
  } else if (healthIndex < 0) {
    return 'NA';
  }
  {
    return '<1';
  }
};

const HealthCircle = ({ healthIndex }) => {
  if (healthIndex > 2.0 || healthIndex < 0) {
    return <HealthCircleSVG stroke={COLOR.blue} />;
  } else if (healthIndex > 1.0) {
    return <HealthCircleSVG stroke={COLOR.orange} />;
  }
  return <HealthCircleSVG stroke={COLOR.pink} />;
};

export default function Main(props) {
  const { accountBalance } = props;
  const { prices, setPrices, balances, setBalances } = useWallet();

  let result = 0;
  for (let index = 0; index < 5; index++) {
    result += prices[index] * balances[index];
  }

  const getHealthIndex = () => {
    if (
      !accountBalance ||
      accountBalance.debtBalance === 0 ||
      accountBalance.borrowLimit === 0
    ) {
      return -1;
    }
    const index = accountBalance.borrowLimit / accountBalance.debtBalance;
    if (isNaN(index)) {
      return -1;
    }
    return index;
  };

  const healthIndex = getHealthIndex();

  const getHealthIndexStyle = () => {
    const color = getHealthIndexColor(healthIndex);
    if (healthIndex >= 10) {
      return {
        color,
        fontSize: 50,
        left: 95,
      };
    }
    return { color };
  };

  return (
    <div className={styles.container}>
      <div className={styles.item}>
        <p className={styles.cellLabel}>TOTAL SUPPLY</p>
        <p className={styles.cellNumber}>
          ${numberToReadableString(accountBalance.supplyBalance, true)}
        </p>
      </div>
      <div className={styles.item}>
        <p className={styles.cellLabel}>TOTAL BORROW</p>
        <p className={styles.cellNumber}>
          ${numberToReadableString(accountBalance.debtBalance, true)}
        </p>
      </div>
      <div className={[styles.item, styles.health].join(' ')}>
        <p className={styles.cellLabel}>
          HEALTH INDEX <Hint text={EXPLAINATION.healthIndex} />
        </p>
        <div className={styles.circle}>
          <HealthCircle healthIndex={healthIndex} />
        </div>
        <p className={styles.index} style={getHealthIndexStyle()}>
          {getHealthIndexText(healthIndex)}
        </p>
        <p className={styles.threshold}>LIQUIDATION THRESHOLD: 1.0</p>
      </div>
      <div className={styles.item}>
        <p className={styles.cellLabel}>
          Borrow Limit <Hint text={EXPLAINATION.borrowLimit} />
        </p>

        <p className={styles.cellNumber}>
          ${numberToReadableString(accountBalance.borrowLimit, true)}
        </p>
      </div>
      <div className={styles.item}>
        <p className={styles.cellLabel}>TOTAL WALLET BALLANCE</p>
        <p className={styles.cellNumber}>
          ${numberToReadableString(result, true)}
        </p>
      </div>
    </div>
  );
}
