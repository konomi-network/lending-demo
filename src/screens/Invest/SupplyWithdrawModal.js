import React, { useEffect, useState } from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

import { useSubstrate } from 'services/substrate-lib';
import { KNTxButton } from 'services/substrate-lib/components';
import { fixed32ToNumber, fixed32ToAPY, balanceToUnitNumber, numberToReadableString } from 'utils/numberUtils';
import KonomiImage from 'resources/img/KONO.png';
import DotImage from 'resources/img/DOT.png';
import KsmImage from 'resources/img/KSM.png';
import EthImage from 'resources/img/ETH.png';
import BtcImage from 'resources/img/BTC.png';
import CloseIcon from 'resources/img/close_black.png';

import './MarketModal.css';

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
  const [price, setPrice] = useState(0);
  const [walletBalanceNumber, setWalletBalanceNumber] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);
  const [currentSupply, setCurrentSupply] = useState(0);
  const [loaderActive, setLoaderActive] = useState(false);
  const [processingText, setProcessingText] = useState('Processing');

  const { api } = useSubstrate();

  const numberInput = React.createRef();

  useEffect(() => {
    let unsubPrice = null;
    let unsubWallet = null;
    let unsubSupply = null;

    if (assetId != null) {
      const getPrice = async () => {
        unsubPrice = await api.query.assets.price(assetId, (priceData) => {
          if (priceData) {
            setPrice(fixed32ToNumber(priceData));
          }
        });
      };
      getPrice();

      const getSupplyAPY = async () => {
        const rate = await api.rpc.lending.supplyRate(assetId);
        if (rate) {
          setAPY(fixed32ToAPY(rate));
        } else {
          setAPY(0);
        }
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
      const getCurrentSupply = async () => {
        unsubSupply = await api.query.lending.userSupplies(assetId, accountPair.address, userData => {
          if (userData.isSome) {
            const dataUnwrap = userData.unwrap();
            setCurrentSupply(balanceToUnitNumber(dataUnwrap.amount));
          } else {
            setCurrentSupply(0);
          }
        });
      };
      getCurrentSupply();
    }

    return () => {
      unsubPrice && unsubPrice();
      unsubWallet && unsubWallet();
      unsubSupply && unsubSupply();
    };
  }, [api.query.lending, api.query.assets, api.rpc.lending, accountPair, assetId]);

  const onChangeInput = (event) => {
    setInputValue(event.target.value);
    const numberValue = parseFloat(event.target.value).toPrecision(12);
    if (numberValue && !isNaN(numberValue)) {
      setInputNumberValue(numberValue);
    } else {
      setInputNumberValue(0);
    }
  };

  const getTabItemStyle = (name) => {
    if (name === activeItem) {
      return "MarketModal-menu-item MarketModal-menu-active";  
    }
    return "MarketModal-menu-item";
  }

  const onClickMenuItem = (name) => {
    return () => {
      setActiveItem(name);
      setTxCallable(name === 'Supply' ? 'supply' : 'withdraw');
    }
  };

  const onClickSubmitButton = () => {;
    setLoaderActive(true);
  };

  const onTxSuccess = (status) => {
    setLoaderActive(false);
    setModalOpen(false);
  }

  const onTxProcessing = (status) => {
    // Ready -> InBlock -> Finalized
    if (status.isReady) {
      setProcessingText('Processing: Ready');
    } else if (status.isInBlock) {
      setProcessingText('Processing: In block');
    }
  }

  const onTxFail = (err) => {
    setLoaderActive(false);
    if (err.toString() === 'Error: Cancelled') {
      // TODO: show something for cancel case;
    } else {
      alert(`Transaction Failed: ${err.toString()}`);
    }
  }

  const txInputValue = () => {
    if (inputNumberValue <= 0 || isNaN(inputNumberValue)) {
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
      if (inputNumberValue > currentSupply) {
        // Withdraw amount exceeds the current supply.
        return null;
      } else {
        return BigInt(inputNumberValue * moneyBase);
      }
    }
  };

  return (
    <div className="MarketModal-container">
      <Dimmer active={loaderActive}>
        <Loader size='small' active={loaderActive}>{processingText}</Loader>
      </Dimmer>
      <div className="MarketModal-header">
        <img className="MarketModal-header-image" src={ASSET_LIST[assetId].image} alt="header-asset-icon" />
        <p className="MarketModal-header-title">{ASSET_LIST[assetId].name}</p>
        <div onClick={() => setModalOpen(false)} className="MarketModal-header-close-button">
          <img className='MarketModal-header-close-icon' src={CloseIcon} alt='supply-modal-close-icon' />
        </div>
      </div>
      <div className="MarketModal-input-container">
        <div className="MarketModal-input-box-container">
          <input
            className="MarketModal-input"
            ref={numberInput}
            value={inputValue}
            autoFocus={true}
            onChange={onChangeInput} />
          <p className="MarketModal-input-abbr">{ASSET_LIST[assetId].abbr}</p>
        </div>
        <div className="MarketModal-input-wallet-container">
          <p className="MarketModal-input-wallet-balance">{walletBalance}</p>
          <p className="MarketModal-input-wallet-text">AVAILABLE IN WALLET</p>
        </div>
      </div>
      <div className="MarketModal-menu">
        <a className={getTabItemStyle('Supply')} onClick={onClickMenuItem('Supply')}>Supply</a>
        <a className={getTabItemStyle('Withdraw')} onClick={onClickMenuItem('Withdraw')}>Withdraw</a>
      </div>
      <div className="MarketModal-trans-info">
        <div className="MarketModal-trans-info-row">
          <img className="MarketModal-rate-icon" src={ASSET_LIST[assetId].image} alt="asset-icon" />
          <p className="MarketModal-trans-info-text">Supply APY</p>
          <div className="MarketModal-trans-info-row-middle"></div>
          <p className="MarketModal-trans-info-number">{apy}%</p>
        </div>
        <div className="MarketModal-trans-info-row">
          <p className="MarketModal-trans-info-text">Current Supply</p>
          <div className="MarketModal-trans-info-row-middle"></div>
          <p className="MarketModal-trans-info-number">
            {`${numberToReadableString(currentSupply)} ${ASSET_LIST[assetId].abbr}`}
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
          onSuccess={onTxSuccess}
          onProcessing={onTxProcessing}
          onFail={onTxFail}
          style={{ width: '100%', height: '60px', backgroundColor: '#25C1D5', color: 'white', fontSize: '18px' }}
          attrs={{
            palletRpc: 'lending',
            callable: txCallable,
            inputParams: [assetId, txInputValue()],
            paramFields: [true, true]
          }}
          onClick={onClickSubmitButton}
        />
      </div>
    </div>
  );
}