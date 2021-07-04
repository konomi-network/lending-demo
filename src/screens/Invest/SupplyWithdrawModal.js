import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Dimmer, Loader } from 'semantic-ui-react';

import { KNTxButton } from 'services/substrate-lib/components';
import { numberToReadableString, numberToU128String } from 'utils/numberUtils';
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
    supplies,
    prices,
  } = props;

  const [inputValue, setInputValue] = useState(0);
  const [inputNumberValue, setInputNumberValue] = useState(null);
  const [activeItem, setActiveItem] = useState('Supply');
  const [txCallable, setTxCallable] = useState('supply');
  const [txStatus, setTxStatus] = useState(null);
  const [loaderActive, setLoaderActive] = useState(false);
  const [processingText, setProcessingText] = useState('Processing');

  const abbr = pools[assetId].name;
  const price = prices[abbr];
  const currentSupply = supplies[abbr];
  const walletBalance = walletBalances[abbr];
  const pool = pools[abbr];
  let apy = 0;
  if (pool && pool.supplyAPY && pool.supplyAPY !== '0') {
    const apyNumber = parseInt(pool.supplyAPY) / 100000;
    apy = apyNumber.toFixed(2);
  }

  const numberInput = React.createRef();

  const onChangeInput = event => {
    setInputValue(event.target.value);
    // const numberValue = parseFloat(event.target.value).toPrecision(12);
    const numberValue = parseFloat(event.target.value);
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
      setTxCallable(name === 'Supply' ? 'supply' : 'withdraw');
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
    if (activeItem === 'Supply') {
      if (walletBalance < inputNumberValue) {
        // New supply exceeds wallet balance.
        return null;
      } else {
        return numberToU128String(inputNumberValue);
      }
    } else {
      if (inputNumberValue > currentSupply) {
        // Withdraw amount exceeds the current supply.
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
          src={COIN_IMAGES[pool.name]}
          alt="header-asset-icon"
        />
        <p className="MarketModal-header-title">{pool.name}</p>
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
            ref={numberInput}
            value={inputValue}
            autoFocus={true}
            onChange={onChangeInput}
          />
          <p className="MarketModal-input-abbr">{abbr}</p>
        </div>
        <div className="MarketModal-input-wallet-container">
          <p className="MarketModal-input-wallet-balance">{walletBalance}</p>
          <p className="MarketModal-input-wallet-text">AVAILABLE IN WALLET</p>
        </div>
      </div>
      <div className="MarketModal-menu">
        <a
          className={getTabItemStyle('Supply')}
          onClick={onClickMenuItem('Supply')}
        >
          Supply
        </a>
        <a
          className={getTabItemStyle('Withdraw')}
          onClick={onClickMenuItem('Withdraw')}
        >
          Withdraw
        </a>
      </div>
      <div className="MarketModal-trans-info">
        <div className="MarketModal-trans-info-row">
          <img
            className="MarketModal-rate-icon"
            src={COIN_IMAGES[pool.name]}
            alt="asset-icon"
          />
          <p className="MarketModal-trans-info-text">Supply APY</p>
          <div className="MarketModal-trans-info-row-middle"></div>
          <p className="MarketModal-trans-info-number">{apy}%</p>
        </div>
        <div className="MarketModal-trans-info-row">
          <p className="MarketModal-trans-info-text">Current Supply</p>
          <div className="MarketModal-trans-info-row-middle"></div>
          <p className="MarketModal-trans-info-number">
            {`${numberToReadableString(currentSupply)} ${abbr}`}
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
  supplies: state.market.supplies,
  prices: state.market.prices,
});

export default connect(mapStateToProps)(Main);
