import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Dimmer, Loader } from 'semantic-ui-react';

import { KNTxButton } from 'services/substrate-lib/components';
import {
  numberToReadableString,
  numberToU128String,
  formatWithDecimal,
} from 'utils/numberUtils';
import { COIN_IMAGES } from 'utils/coinImages';
import CloseIcon from 'resources/img/close_black.png';

import './MarketModal.scss';

function Main(props) {
  const {
    assetId,
    setModalOpen,
    accountPair,
    walletBalances,
    pools,
    liquidationThreshold,
    decimals,
  } = props;

  const [inputValue, setInputValue] = useState(0);
  const [inputNumberValue, setInputNumberValue] = useState(null);
  const [activeItem, setActiveItem] = useState('Borrow');
  const [txCallable, setTxCallable] = useState('borrow');
  const [txStatus, setTxStatus] = useState(null);
  const [loaderActive, setLoaderActive] = useState(false);
  const [processingText, setProcessingText] = useState('Processing');

  const rowData = pools[assetId];
  const abbr = rowData.name;
  const price = formatWithDecimal(rowData.price, decimals);
  const currentBorrow = formatWithDecimal(rowData.borrow, decimals);
  const currentSupply = formatWithDecimal(rowData.supply, decimals);
  const currentBorrowLimit = currentSupply;
  const walletBalance = walletBalances[abbr];
  let apy = 0;
  if (rowData && rowData.borrowAPY && rowData.borrowAPY !== '0') {
    const apyNumber = formatWithDecimal(rowData.borrowAPY, decimals) * 100;
    apy = apyNumber.toFixed(2);
  }

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
        return numberToU128String(inputNumberValue);
      }
    } else {
      if (inputNumberValue > walletBalance) {
        // Repay exceeds wallet balance.
        return null;
      } else {
        return numberToU128String(inputNumberValue);
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
          src={COIN_IMAGES[rowData.name]}
          alt="header-asset-icon"
        />
        <p className="MarketModal-header-title">{rowData.name}</p>
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
            src={COIN_IMAGES[rowData.name]}
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
  pools: state.market.pools,
  decimals: state.market.decimals,
  liquidationThreshold: state.market.liquidationThreshold,
});

export default connect(mapStateToProps)(Main);
