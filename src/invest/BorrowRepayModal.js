import React, { useEffect, useState } from 'react';
import { Button, Icon, Menu } from 'semantic-ui-react';

import { useSubstrate } from '../substrate-lib';
import { KNTxButton } from '../substrate-lib/components';
import { fixed32ToNumber, fixed32ToAPY, balanceToUnitNumber, numberToReadableString } from '../numberUtils';
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
  const [price, setPrice] = useState(0);
  const [walletBalanceNumber, setWalletBalanceNumber] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [currentBorrow, setCurrentBorrow] = useState(0);
  const [debtBalance, setDebtBalance] = useState(0);
  const [borrowLimit, setBorrowLimit] = useState(0);

  const { api } = useSubstrate();

  useEffect(() => {
    let unsubPrice = null;
    let unsubAPY = null;
    let unsubWallet = null;
    let unsubBorrow = null;
    let unsubUser = null;

    if (assetId != null) {
      const getPrice = async () => {
        unsubPrice = await api.query.assets.price(assetId, (priceData) => {
          if (priceData) {
            setPrice(fixed32ToNumber(priceData));
          }
        });
      };
      getPrice();

      const getBorrowAPY = async () => {
        unsubAPY = await api.rpc.lending.debtRate(assetId, rate => {
          if (rate) {
            setAPY(fixed32ToAPY(rate));
          } else {
            setAPY(0);
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
      const getCurrentBorrow = async () => {
        unsubBorrow = await api.query.lending.userDebts(assetId, accountPair.address, userData => {
          if (userData.isSome) {
            const dataUnwrap = userData.unwrap();
            setCurrentBorrow(balanceToUnitNumber(dataUnwrap.amount));
          } else {
            setCurrentBorrow(0);
          }
        });
      };
      getCurrentBorrow();

      const getAccountBalance = async () => {
        unsubUser = await api.rpc.lending.getUserInfo(accountPair.address, userData => {
          const [supplyBalance, borrowLimit, debtBalance] = userData;
          setBorrowLimit(balanceToUnitNumber(borrowLimit));
          setDebtBalance(balanceToUnitNumber(debtBalance));
        });
      };
      getAccountBalance();
    }

    return () => {
      unsubPrice && unsubPrice();
      unsubAPY && unsubAPY();
      unsubWallet && unsubWallet();
      unsubBorrow && unsubBorrow();
      unsubUser && unsubUser();
    };
  }, [api.query.lending, api.query.assets, api.rpc.lending, accountPair, assetId]);

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
    // if (activeItem === 'Borrow') {
    //   return (
    //     <div className="MarketModal-trans-info-row">
    //       <p className="MarketModal-trans-info-text">
    //         Curently Borrowing
    //       </p>
    //       <div className="MarketModal-trans-info-row-middle"></div>
    //       <p className="MarketModal-trans-info-number">
    //         ${numberToReadableString(accountBalance.debtBalance, true)}
    //       </p>
    //     </div>
    //   );
    // }
    return (
      <div className="MarketModal-trans-info-row">
        <p className="MarketModal-trans-info-text">Wallet Balance</p>
        <div className="MarketModal-trans-info-row-middle"></div>
        <p className="MarketModal-trans-info-number">{`${walletBalance} ${ASSET_LIST[assetId].abbr}`}</p>
      </div>
    );
  };

  const txInputValue = () => {
    if (inputNumberValue <= 0) {
      return null;
    }
    if (activeItem === 'Borrow') {
      const newDebt = inputNumberValue * price;
      console.log("new input");
      console.log(newDebt);
      console.log(debtBalance);
      console.log(borrowLimit);
      if (debtBalance + newDebt > borrowLimit * 0.9) {
        // New borrow balance exceeds borrow limit * 0.9.
        return null;
      } else {
        return BigInt(inputNumberValue * moneyBase);
      }
    } else {
      if (inputNumberValue > walletBalanceNumber) {
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
            {`${numberToReadableString(currentBorrow)} ${ASSET_LIST[assetId].abbr}`}
          </p>
        </div>
        <div className="MarketModal-trans-info-row">
          <p className="MarketModal-trans-info-text">Price</p>
          <div className="MarketModal-trans-info-row-middle"></div>
          <p className="MarketModal-trans-info-number">
            {`$ ${numberToReadableString(price, true)}`}
          </p>
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
