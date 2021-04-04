import React from 'react';

import { Hint } from 'components';
import { ReactComponent as HealthCircle } from 'resources/icons/HealthCircle.svg';
import { numberToReadableString } from 'utils/numberUtils';
import { useWallet } from './WalletContext';

import styles from './Dashboard.module.scss';

const EXPLAINATION = {
  healthIndex:
    'Indicates how healthy how account it. If this is below Liquidation Threshold, your account will be liquidated.',
  borrowLimit:
    'The amount you can borrow. It is the weighted valuation of your collateral.',
};

const COLOR = {
  blue: '#20EFEF',
  orange: '#F18B14',
  pink: '#CF1891',
};

// TODO: unifiy the logic
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
  return '<1';
};

const getHealthIndexColor = healthIndex => {
  // [min, 0) + [2 ~ max ]
  if (healthIndex >= 2) {
    return COLOR.blue;
    // [1 ~ 2)
  } else if (healthIndex >= 1) {
    return COLOR.orange;
    // [0 ~ 1)
  } else if (healthIndex >= 0) {
    return COLOR.pink;
  }
  // < 0
  return COLOR.blue;
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
  const indexColor = getHealthIndexColor(healthIndex);

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
          <HealthCircle stroke={indexColor} />
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
