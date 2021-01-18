import React, { useEffect, useState } from 'react';
import { Button, Icon, Menu } from 'semantic-ui-react';

import { useSubstrate } from '../substrate-lib';
import { KNTxButton } from '../substrate-lib/components';
import { balanceToAPY, balanceToUnitNumber, numberToReadableString } from '../numberUtils';
import KonomiImage from '../resources/img/KONO.png';
import DotImage from '../resources/img/DOT.png';
import KsmImage from '../resources/img/KSM.png';
import EthImage from '../resources/img/ETH.png';
import BtcImage from '../resources/img/BTC.png';

import './BorrowRepayModal.css';

/* global BigInt */

const ASSET_LIST = [
  { id: 0, name: 'Konomi', abbr: 'KONO', image: KonomiImage, apy: 0.0002, price: 100 },
  { id: 1, name: 'Polkadot', abbr: 'DOT', image: DotImage, apy: 0.0204, price: 60 },
  { id: 2, name: 'Kusama', abbr: 'KSM', image: KsmImage, apy: 0.039, price: 5 },
  { id: 3, name: 'Ethereum', abbr: 'ETH', image: EthImage, apy: 0.0004, price: 600 },
  { id: 4, name: 'Bitcoin', abbr: 'BTC', image: BtcImage, apy: 0.0078, price: 20000 }
];

const moneyBase = 1000000000000;

export default function Main (props) {
  const { assetId, setModalOpen, accountPair } = props;

  const [inputValue, setInputValue] = useState(0);
  const [inputNumberValue, setInputNumberValue] = useState(null);
  const [activeItem, setActiveItem] = useState('Borrow');
  const [txCallable, setTxCallable] = useState('borrow');
  const [txStatus, setTxStatus] = useState(null);
  const [apy, setAPY] = useState(0);
  const [liquidity, setLiquidity] = useState(0);
  const [walletBalanceNumber, setWalletBalanceNumber] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [accountBalance, setAccountBalance] = useState({ borrowLimit: 0, supplyBalance: 0, debtBalance: 0, usedPercent: 0 });

  const { api } = useSubstrate();

  useEffect(() => {
    let unsubAPY = null;
    let unsubWallet = null;
    let unsubUser = null;

    if (assetId != null) {
      const getBorrowAPY = async () => {
        unsubAPY = await api.query.lending.pools(assetId, assetPool => {
          if (assetPool.isSome) {
            const unwrappedPool = assetPool.unwrap();
            const apyNumber = balanceToAPY(unwrappedPool.debtAPY);
            setAPY(apyNumber);
            const liquidityInt = balanceToUnitNumber(unwrappedPool.supply) - balanceToUnitNumber(unwrappedPool.debt);
            setLiquidity(liquidityInt);
          } else {
            setAPY(0);
            setLiquidity(0);
          }
        });
      };
      getBorrowAPY();

      if (accountPair) {
        const getWallet = async () => {
          unsubWallet = await api.query.assets.balances([assetId, accountPair.address], balance => {
            const balanceNum = balanceToUnitNumber(balance);
            setWalletBalanceNumber(balanceNum);
            setWalletBalance(numberToReadableString(balanceNum, true));
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
      setInputNumberValue(null);
    }
  };

  const onClickMenuItem = (event, { name }) => {
    setActiveItem(name);
    setTxCallable(name === 'Borrow' ? 'borrow' : 'repay');
  };

  const onClickSubmitButton = () => {
    setModalOpen(false);
  };

  const renderWalletRow = () => {
    if (activeItem === 'Borrow') {
      return (
        <div className="MarketModal-trans-info-row">
          <p className="MarketModal-trans-info-text">
            Curently Borrowing
          </p>
          <div className="MarketModal-trans-info-row-middle"></div>
          <p className="MarketModal-trans-info-number">
            ${numberToReadableString(accountBalance.debtBalance, true)}
          </p>
        </div>
      );
    }
    return (
      <div className="MarketModal-trans-info-row">
        <p className="MarketModal-trans-info-text">Wallet Balance</p>
        <div className="MarketModal-trans-info-row-middle"></div>
        <p className="MarketModal-trans-info-number">{`${walletBalance} ${ASSET_LIST[assetId].abbr}`}</p>
      </div>
    );
  };

  const renderBorrowBalanceText = () => {
    const oldBorrowText = '$' + numberToReadableString(accountBalance.debtBalance, true);
    if (!inputNumberValue) {
      return oldBorrowText;
    }
    if (activeItem === 'Borrow') {
      const increasedBorrow = inputNumberValue * ASSET_LIST[assetId].price;
      const newDebt = accountBalance.debtBalance + increasedBorrow;
      return oldBorrowText + ' -> ' + '$' + numberToReadableString(newDebt, true);
    } else {
      const decreasedBorrow = inputNumberValue * ASSET_LIST[assetId].price;
      let newDebt = accountBalance.debtBalance - decreasedBorrow;
      newDebt = newDebt < 0 ? 0 : newDebt;
      return oldBorrowText + ' -> ' + '$' + numberToReadableString(newDebt, true);
    }
  };

  const renderUsedPercentText = () => {
    const oldUsedPercent = accountBalance.usedPercent + '%';
    if (!inputNumberValue) {
      return oldUsedPercent;
    }
    if (activeItem === 'Borrow') {
      const increasedBorrow = inputNumberValue * ASSET_LIST[assetId].price;
      const newDebt = accountBalance.debtBalance + increasedBorrow;
      const newUsedPercent = (newDebt / accountBalance.borrowLimit * 100).toFixed(2) + '%';
      return oldUsedPercent + ' -> ' + newUsedPercent;
    } else {
      const decreasedBorrow = inputNumberValue * ASSET_LIST[assetId].price;
      let newDebt = accountBalance.debtBalance - decreasedBorrow;
      newDebt = newDebt < 0 ? 0 : newDebt;
      let newUsedPercent = null;
      if (newDebt === 0) {
        newUsedPercent = '0%';
      } else {
        newUsedPercent = (newDebt / accountBalance.borrowLimit * 100).toFixed(2) + '%';
      }
      return oldUsedPercent + ' -> ' + newUsedPercent;
    }
  };

  const txInputValue = () => {
    if (inputNumberValue <= 0) {
      return null;
    }
    if (activeItem === 'Borrow') {
      const newDebt = inputNumberValue * ASSET_LIST[assetId].price;
      if (accountBalance.debtBalance + newDebt > accountBalance.borrowLimit) {
        // New borrow balance exceeds borrow limit.
        return null;
      } else if (inputNumberValue > liquidity) {
        // Borrow value exceeds liquidity.
        return null;
      } else {
        return BigInt(inputNumberValue * moneyBase);
      }
    } else {
      if (inputNumberValue * ASSET_LIST[assetId].price > accountBalance.debtBalance) {
        // Repay value exceeds borrow balance.
        return null;
      } else if (inputNumberValue > walletBalanceNumber) {
        // Repay exceeds wallet balance.
        return null;
      } else {
        return BigInt(inputNumberValue * moneyBase);
      }
    }
  };

  return (
    <div className="MarketModal-container">
      <div className="MarketModal-header">
        <img className="MarketModal-header-image" src={ASSET_LIST[assetId].image} alt="header-asset-icon"/>
        <p className="MarketModal-header-title">{ASSET_LIST[assetId].name}</p>
        <Button icon onClick={() => setModalOpen(false)} className="MarketModal-header-close-button">
          <Icon name='close' />
        </Button>
      </div>
      <div className="MarketModal-input-container">
        <input className="MarketModal-input" value={inputValue} autoFocus={true} onChange={onChangeInput} />
      </div>
      <Menu pointing secondary color={'purple'} widths={2}>
        <Menu.Item
          name='Borrow'
          active={activeItem === 'Borrow'}
          onClick={onClickMenuItem}
        />
        <Menu.Item
          name='Repay'
          active={activeItem === 'Repay'}
          onClick={onClickMenuItem}
        />
      </Menu>
      <div className="MarketModal-trans-info">
        <div className="MarketModal-trans-info-row">
          <img className="MarketModal-borrow-rate-icon" src={ASSET_LIST[assetId].image} alt="asset-icon" />
          <p className="MarketModal-trans-info-text">Borrow APY</p>
          <div className="MarketModal-trans-info-row-middle"></div>
          <p className="MarketModal-trans-info-apy-number">
            {apy}%
          </p>
        </div>
        <div className="MarketModal-trans-info-row">
          <p className="MarketModal-trans-info-text">Borrow Balance</p>
          <div className="MarketModal-trans-info-row-middle"></div>
          <p className="MarketModal-trans-info-number">
            {renderBorrowBalanceText()}
          </p>
        </div>
        <div className="MarketModal-trans-info-row">
          <p className="MarketModal-trans-info-text">Borrow Limit Used</p>
          <div className="MarketModal-trans-info-row-middle"></div>
          <p className="MarketModal-trans-info-number">{renderUsedPercentText()}</p>
        </div>
        <KNTxButton
          accountPair={accountPair}
          label={activeItem}
          type='SIGNED-TX'
          setStatus={setTxStatus}
          style={{ width: '100%', height: '60px', backgroundColor: '#9669ed', color: 'white', fontSize: '18px' }}
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
