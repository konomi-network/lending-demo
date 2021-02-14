import React, { useEffect, useState } from 'react';
import { Button, Icon, Menu } from 'semantic-ui-react';

import { useSubstrate } from '../substrate-lib';
import { KNTxButton } from '../substrate-lib/components';
import { fixed32ToAPY, balanceToUnitNumber, numberToReadableString } from '../numberUtils';
import KonomiImage from '../resources/img/KONO.png';
import DotImage from '../resources/img/DOT.png';
import KsmImage from '../resources/img/KSM.png';
import EthImage from '../resources/img/ETH.png';
import BtcImage from '../resources/img/BTC.png';

import './SupplyWithdrawModal.css';

const ASSET_LIST = [
  { id: 0, name: 'Konomi', abbr: 'KONO', image: KonomiImage, apy: 0.0002, price: 100 },
  { id: 1, name: 'Polkadot', abbr: 'DOT', image: DotImage, apy: 0.0204, price: 60 },
  { id: 2, name: 'Kusama', abbr: 'KSM', image: KsmImage, apy: 0.039, price: 5 },
  { id: 3, name: 'Ethereum', abbr: 'ETH', image: EthImage, apy: 0.0004, price: 600 },
  { id: 4, name: 'Bitcoin', abbr: 'BTC', image: BtcImage, apy: 0.0078, price: 20000 }
];

/* global BigInt */

const moneyBase = 1000000000000;

export default function Main (props) {
  const { assetId, setModalOpen, accountPair } = props;

  const [inputValue, setInputValue] = useState(0);
  const [inputNumberValue, setInputNumberValue] = useState(null);
  const [activeItem, setActiveItem] = useState('Supply');
  const [txCallable, setTxCallable] = useState('supply');
  const [txStatus, setTxStatus] = useState(null);
  const [apy, setAPY] = useState(0);
  const [liquidity, setLiquidity] = useState(0);
  const [walletBalanceNumber, setWalletBalanceNumber] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [accountBalance, setAccountBalance] = useState({ borrowLimit: 0, supplyBalance: 0, debtBalance: 0, usedPercent: 0 });

  const { api } = useSubstrate();

  const numberInput = React.createRef();

  useEffect(() => {
    let unsubLiquidity = null;
    let unsubAPY = null;
    let unsubWallet = null;
    let unsubUser = null;

    if (assetId != null) {
      const getLiquidity = async () => {
        unsubLiquidity = await api.query.lending.pools(assetId, assetPool => {
          if (assetPool.isSome) {
            const unwrappedPool = assetPool.unwrap();
            const liquidityInt = balanceToUnitNumber(unwrappedPool.supply)
                - balanceToUnitNumber(unwrappedPool.debt);
            setLiquidity(liquidityInt);
          } else {
            setLiquidity(0);
          }
        });
      };
      getLiquidity();

      const getSupplyAPY = async () => {
        unsubAPY = await api.rpc.lending.supplyRate(assetId, rate => {
          if (rate) {
            setAPY(fixed32ToAPY(rate));
          } else {
            setAPY(0);
          }
        });
      };
      getSupplyAPY();

      if (accountPair) {
        const getWallet = async () => {
          unsubWallet = await api.query.assets.balances([assetId, accountPair.address], balance => {
            const balanceNum = balanceToUnitNumber(balance);
            setWalletBalanceNumber(balanceNum);
            setWalletBalance(numberToReadableString(balanceNum));
          });
        };
        getWallet();
      }
    }

    if (accountPair) {
      const getAccountBalance = async () => {
        unsubUser = await api.query.lending.users(accountPair.address, userData => {
          if (userData.isSome) {
            const dataUnwrap = userData.unwrap();
            const borrowLimit = dataUnwrap.borrowLimit
              ? balanceToUnitNumber(dataUnwrap.borrowLimit) : 0;
            const supplyBalance = dataUnwrap.supplyBalance
              ? balanceToUnitNumber(dataUnwrap.supplyBalance) : 0;
            const debtBalance = dataUnwrap.debtBalance
              ? balanceToUnitNumber(dataUnwrap.debtBalance) : 0;
            let usedPercent = 0;
            if (borrowLimit !== 0) {
              usedPercent = (debtBalance / borrowLimit * 100).toFixed(2);
            }
            setAccountBalance({ borrowLimit, supplyBalance, debtBalance, usedPercent });
          } else {
            setAccountBalance({ borrowLimit: 0, supplyBalance: 0, debtBalance: 0, usedPercent: 0 });
          }
        });
      };
      getAccountBalance();
    }

    return () => {
      unsubLiquidity && unsubLiquidity();
      unsubAPY && unsubAPY();
      unsubWallet && unsubWallet();
      unsubUser && unsubUser();
    };
  }, [api.query.lending, api.query.assets, accountPair, assetId]);

  const onChangeInput = (event) => {
    setInputValue(event.target.value);
    const numberValue = parseFloat(event.target.value);
    if (numberValue) {
      setInputNumberValue(numberValue);
    } else {
      setInputNumberValue(0);
    }
  };

  // const onClickMaxButton = () => {
  //   if (activeItem === 'Supply') {
  //     setInputNumberValue(walletBalanceNumber);
  //     setInputValue(walletBalanceNumber);
  //   } else {
  //
  //   }
  // }
  //
  const renderMaxButton = () => {
    // if (activeItem === 'Supply') {
    //   return (
    //     <button className="MarketModal-max-button" onClick={onClickMaxButton}>
    //       Max
    //     </button>
    //   )
    // } else {
      return null;
    // }
  }

  const onClickMenuItem = (event, { name }) => {
    setActiveItem(name);
    setTxCallable(name === 'Supply' ? 'supply' : 'withdraw');
  };

  const onClickSubmitButton = () => {
    setModalOpen(false);
  };

  const renderWalletRow = () => {
    if (activeItem === 'Supply') {
      return (
        <div className="MarketModal-trans-info-row">
          <p className="MarketModal-trans-info-text">Wallet Balance</p>
          <div className="MarketModal-trans-info-row-middle"></div>
          <p className="MarketModal-trans-info-number">{`${walletBalance} ${ASSET_LIST[assetId].abbr}`}</p>
        </div>
      );
    }
    return (
      <div className="MarketModal-trans-info-row">
        <p className="MarketModal-trans-info-text">Current Supplying</p>
        <div className="MarketModal-trans-info-row-middle"></div>
        <p className="MarketModal-trans-info-number">
          ${numberToReadableString(accountBalance.supplyBalance)}
        </p>
      </div>
    );
  };

  const renderSupplyLimitText = () => {
    const oldBorrowText = '$' + numberToReadableString(accountBalance.borrowLimit, true);
    if (!inputNumberValue) {
      return oldBorrowText;
    }
    if (activeItem === 'Supply') {
      const increasedBorrow = inputNumberValue * ASSET_LIST[assetId].price * 2 / 3;
      const newBorrowLimit = accountBalance.borrowLimit + increasedBorrow;
      return oldBorrowText + ' -> ' + '$' + numberToReadableString(newBorrowLimit, true);
    } else {
      const decreasedBorrow = inputNumberValue * ASSET_LIST[assetId].price * 2 / 3;
      let newBorrowLimit = accountBalance.borrowLimit - decreasedBorrow;
      newBorrowLimit = newBorrowLimit < 0 ? 0 : newBorrowLimit;
      return oldBorrowText + ' -> ' + '$' + numberToReadableString(newBorrowLimit, true);
    }
  };

  const renderUsedPercentText = () => {
    const oldUsedPercent = accountBalance.usedPercent + '%';
    if (!inputNumberValue) {
      return oldUsedPercent;
    }
    if (activeItem === 'Supply') {
      const increasedBorrow = inputNumberValue * ASSET_LIST[assetId].price * 2 / 3;
      const newBorrowLimit = accountBalance.borrowLimit + increasedBorrow;
      const newUsedPercent = (accountBalance.debtBalance / (newBorrowLimit) * 100).toFixed(2) + '%';
      return oldUsedPercent + ' -> ' + newUsedPercent;
    } else {
      const decreasedBorrow = inputNumberValue * ASSET_LIST[assetId].price * 2 / 3;
      let newBorrowLimit = accountBalance.borrowLimit - decreasedBorrow;
      newBorrowLimit = newBorrowLimit < 0 ? 0 : newBorrowLimit;
      let newUsedPercent = null;
      if (newBorrowLimit === 0) {
        newUsedPercent = '0%';
      } else {
        newUsedPercent = (accountBalance.debtBalance / newBorrowLimit * 100).toFixed(2) + '%';
      }
      return oldUsedPercent + ' -> ' + newUsedPercent;
    }
  };

  const txInputValue = () => {
    if (inputNumberValue <= 0) {
      return null;
    }
    if (activeItem === 'Supply') {
      if (walletBalanceNumber < inputNumberValue) {
        // New supply exceeds wallet balance.
        return null;
      } else {
        return BigInt(inputNumberValue * moneyBase);
      }
    } else {
      const withdrawValue = inputNumberValue * ASSET_LIST[assetId].price;
      const minSupplyBalance = accountBalance.debtBalance * 1.5;
      if (accountBalance.supplyBalance < withdrawValue + minSupplyBalance) {
        // Supply balance after withdraw exceeds minimum supply balance.
        return null;
      } else if (inputNumberValue > liquidity) {
        return null;
      } else {
        return BigInt(inputNumberValue * moneyBase);
      }
    }
  };

  return (
    <div className="MarketModal-container">
      <div className="MarketModal-header">
        <img className="MarketModal-header-image" src={ASSET_LIST[assetId].image} alt="header-asset-icon" />
        <p className="MarketModal-header-title">{ASSET_LIST[assetId].name}</p>
        <Button icon onClick={() => setModalOpen(false)} className="MarketModal-header-close-button">
          <Icon name='close' />
        </Button>
      </div>
      <div className="MarketModal-input-container">
        <input
          className="MarketModal-input"
          ref={numberInput}
          value={inputValue}
          autoFocus={true}
          onChange={onChangeInput} />
        {renderMaxButton()}
      </div>
      <Menu pointing secondary color={'green'} widths={2}>
        <Menu.Item
          name='Supply'
          active={activeItem === 'Supply'}
          onClick={onClickMenuItem}
        />
        <Menu.Item
          name='Withdraw'
          active={activeItem === 'Withdraw'}
          onClick={onClickMenuItem}
        />
      </Menu>
      <div className="MarketModal-trans-info">
        <div className="MarketModal-trans-info-row">
          <img className="MarketModal-supply-rate-icon" src={ASSET_LIST[assetId].image} alt="asset-icon" />
          <p className="MarketModal-trans-info-text">Supply APY</p>
          <div className="MarketModal-trans-info-row-middle"></div>
          <p className="MarketModal-trans-info-apy-number">{apy}%</p>
        </div>
        <div className="MarketModal-trans-info-row">
          <p className="MarketModal-trans-info-text">Borrow Limit</p>
          <div className="MarketModal-trans-info-row-middle"></div>
          <p className="MarketModal-trans-info-number">
            {renderSupplyLimitText()}
          </p>
        </div>
        <div className="MarketModal-trans-info-row">
          <p className="MarketModal-trans-info-text">Borrow Limit Used</p>
          <div className="MarketModal-trans-info-row-middle"></div>
          <p className="MarketModal-trans-info-number">
            {renderUsedPercentText()}
          </p>
        </div>
        <KNTxButton
          accountPair={accountPair}
          label={activeItem}
          type='SIGNED-TX'
          setStatus={setTxStatus}
          style={{ width: '100%', height: '60px', backgroundColor: '#00d395', color: 'white', fontSize: '18px' }}
          attrs={{
            palletRpc: 'lending',
            callable: txCallable,
            inputParams: [assetId, txInputValue()],
            paramFields: [true, true]
          }}
          onClick={onClickSubmitButton}
        />
        {renderWalletRow()}
      </div>
    </div>
  );
}
