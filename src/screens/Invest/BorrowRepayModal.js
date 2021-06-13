import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Dimmer, Loader } from 'semantic-ui-react';

import { KNTxButton } from 'services/substrate-lib/components';
import { numberToReadableString } from 'utils/numberUtils';
import DotImage from 'resources/img/DOT.png';
import EthImage from 'resources/img/ETH.png';
import CloseIcon from 'resources/img/close_black.png';

import './MarketModal.scss';

const ASSET_LIST = [
  { id: 0, name: 'Polkadot', abbr: 'DOT', image: DotImage },
  { id: 1, name: 'Ethereum', abbr: 'ETH', image: EthImage },
];

function Main(props) {
  const {
    assetId,
    setModalOpen,
    accountPair,
    walletBalances,
    supplies,
    debts,
    prices,
    liquidationThreshold,
  } = props;

  const [inputValue, setInputValue] = useState(0);
  const [inputNumberValue, setInputNumberValue] = useState(null);
  const [activeItem, setActiveItem] = useState('Borrow');
  const [txCallable, setTxCallable] = useState('borrow');
  const [txStatus, setTxStatus] = useState(null);
  const [apy, setAPY] = useState(0);
  const [loaderActive, setLoaderActive] = useState(false);
  const [processingText, setProcessingText] = useState('Processing');

  const abbr = ASSET_LIST[assetId].abbr;
  const price = prices[abbr];
  const currentBorrow = debts[abbr];
  const currentSupply = supplies[abbr];
  const currentBorrowLimit = currentSupply;
  const walletBalance = walletBalances[abbr];

  const onChangeInput = event => {
    setInputValue(event.target.value);
    const numberValue = parseFloat(event.target.value).toPrecision(12);
    if (numberValue && !isNaN(numberValue)) {
      setInputNumberValue(numberValue);
    } else {
      setInputNumberValue(0);
    }
  };

  const getTabItemStyle = name => {
    if (name === activeItem) {
      return 'MarketModal-menu-item MarketModal-menu-active';
    }
    return 'MarketModal-menu-item';
  };

  const onClickMenuItem = name => {
    return () => {
      setActiveItem(name);
      setTxCallable(name === 'Borrow' ? 'borrow' : 'repay');
    };
  };

  const onClickSubmitButton = () => {
    setLoaderActive(true);
  };

  const onTxSuccess = status => {
    setLoaderActive(false);
    setModalOpen(false);
  };

  const onTxProcessing = status => {
    // Ready -> InBlock -> Finalized
    if (status.isReady) {
      setProcessingText('Processing: Ready');
    } else if (status.isInBlock) {
      setProcessingText('Processing: In block');
    }
  };

  const onTxFail = err => {
    setLoaderActive(false);
    if (err.toString() === 'Error: Cancelled') {
      // TODO: show something for cancel case;
    } else {
      alert(`Transaction Failed: ${err.toString()}`);
    }
  };

  const txInputValue = () => {
    if (inputNumberValue <= 0 || isNaN(inputNumberValue)) {
      return null;
    }
    if (activeItem === 'Borrow') {
      if (
        currentBorrow + inputNumberValue >
        (currentBorrowLimit * 0.9) / liquidationThreshold
      ) {
        // New borrow balance exceeds borrow limit * 0.9.
        return null;
      } else {
        return inputNumberValue;
      }
    } else {
      if (inputNumberValue > walletBalance) {
        // Repay exceeds wallet balance.
        return null;
      } else {
        return inputNumberValue;
      }
    }
  };

  return (
    <div className="MarketModal-container">
      <Dimmer active={loaderActive}>
        <Loader size="small" active={loaderActive}>
          {processingText}
        </Loader>
      </Dimmer>
      <div className="MarketModal-header">
        <img
          className="MarketModal-header-image"
          src={ASSET_LIST[assetId].image}
          alt="header-asset-icon"
        />
        <p className="MarketModal-header-title">{ASSET_LIST[assetId].name}</p>
        <div
          onClick={() => setModalOpen(false)}
          className="MarketModal-header-close-button"
        >
          <img
            className="MarketModal-header-close-icon"
            src={CloseIcon}
            alt="supply-modal-close-icon"
          />
        </div>
      </div>
      <div className="MarketModal-input-container">
        <div className="MarketModal-input-box-container">
          <input
            className="MarketModal-input"
            value={inputValue}
            autoFocus={true}
            onChange={onChangeInput}
          />
          <p className="MarketModal-input-abbr">{abbr}</p>
        </div>
        <div className="MarketModal-input-wallet-container">
          <p className="MarketModal-input-wallet-balance">
            {numberToReadableString(walletBalance)}
          </p>
          <p className="MarketModal-input-wallet-text">AVAILABLE IN WALLET</p>
        </div>
      </div>
      <div className="MarketModal-menu">
        <a
          className={getTabItemStyle('Borrow')}
          onClick={onClickMenuItem('Borrow')}
        >
          Borrow
        </a>
        <a
          className={getTabItemStyle('Repay')}
          onClick={onClickMenuItem('Repay')}
        >
          Repay
        </a>
      </div>
      <div className="MarketModal-trans-info">
        <div className="MarketModal-trans-info-row">
          <img
            className="MarketModal-rate-icon"
            src={ASSET_LIST[assetId].image}
            alt="asset-icon"
          />
          <p className="MarketModal-trans-info-text">Borrow APY</p>
          <div className="MarketModal-trans-info-row-middle"></div>
          <p className="MarketModal-trans-info-number">{apy}%</p>
        </div>
        <div className="MarketModal-trans-info-row">
          <p className="MarketModal-trans-info-text">Borrow Balance</p>
          <div className="MarketModal-trans-info-row-middle"></div>
          <p className="MarketModal-trans-info-number">
            {`${numberToReadableString(currentBorrow)} ${abbr}`}
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
          type="SIGNED-TX"
          setStatus={setTxStatus}
          onSuccess={onTxSuccess}
          onProcessing={onTxProcessing}
          onFail={onTxFail}
          style={{
            width: '100%',
            height: '60px',
            backgroundColor: '#25C1D5',
            color: 'white',
            fontSize: '18px',
          }}
          attrs={{
            palletRpc: 'floatingRateLend',
            callable: txCallable,
            inputParams: [assetId + 1, txInputValue()],
            paramFields: [true, true],
          }}
          onClick={onClickSubmitButton}
        />
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  walletBalances: state.wallet.balances,
  supplies: state.market.supplies,
  debts: state.market.debts,
  prices: state.market.prices,
  liquidationThreshold: state.market.liquidationThreshold,
});

export default connect(mapStateToProps)(Main);
