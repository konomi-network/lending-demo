import React, { useState, useEffect, createRef } from 'react';
import { CookiesProvider } from 'react-cookie';

import { ReactComponent as AppLogo } from 'resources/icons/AppLogo.svg';
import { AccountButton, FaucetButton, TabBar } from 'components';
import { TAB_NAME_ARRAY } from 'components/Tabbar/TabBar';
import { ConnectPage, DashboardPage, MarketLists, WelcomePage } from 'screens';
import { fixed32ToNumber, priceToNumber } from 'utils/numberUtils';
import ArrowImage from 'resources/img/arrow_right.png';
import { SubstrateContextProvider, useSubstrate } from 'services/substrate-lib';
import Watermark from 'resources/img/watermark_new.png';
import { connect } from 'react-redux';
import walletAction from 'modules/wallet/actions';
import marketAction from 'modules/market/actions';

import 'semantic-ui-css/semantic.min.css';
import './App.scss';

function Main(props) {
  const {
    updateWalletBalance,
    updateSupply,
    updateDebt,
    updatePrice,
    updateLiquidationThreshold,
  } = props;
  const [accountAddress, setAccountAddress] = useState(null);
  const [selectedTabItem, setSelectedTabItem] = useState(TAB_NAME_ARRAY[0]);
  const { api, apiError, apiState, keyring, keyringState, connectSubstrate } =
    useSubstrate();
  const { invitationActiveState, verifyInvitation } = useSubstrate();

  useEffect(() => {
    if (invitationActiveState == null && accountAddress) {
      const addressList = keyring
        .getPairs()
        .filter(account => account.meta.isInjected)
        .map(account => account.address);
      verifyInvitation(addressList);
    }
  }, [invitationActiveState, keyring, accountAddress]);

  useEffect(() => {
    let unsubThreshold = null;

    if (
      invitationActiveState === 'Activated' &&
      api &&
      api.query.floatingRateLend
    ) {
      console.log('floating liquidation');
      const getThreshold = async () => {
        unsubThreshold = await api.query.floatingRateLend.liquidationThreshold(
          data => {
            if (data) {
              updateLiquidationThreshold(fixed32ToNumber(data));
            }
          }
        );
      };
      getThreshold();
    }
    return () => unsubThreshold && unsubThreshold();
  }, [
    invitationActiveState,
    api,
    api && api.query && api.query.floatingRateLend,
  ]);

  // Monitor wallet balances.
  useEffect(() => {
    let unsubDotBalance = null;
    let unsubEthBalance = null;
    const getDotWalletBalance = async () => {
      unsubDotBalance = await api.query.tokens.accounts(
        accountAddress,
        { native: { id: 0 } },
        accountData => {
          updateWalletBalance('DOT', accountData.free.toNumber());
        }
      );
    };
    const getEthWalletBalance = async () => {
      unsubEthBalance = await api.query.tokens.accounts(
        accountAddress,
        { native: { id: 1 } },
        accountData => {
          updateWalletBalance('ETH', accountData.free.toNumber());
        }
      );
    };
    if (accountAddress && api && api.query && api.query.tokens) {
      console.log('get wallet balance');
      getDotWalletBalance();
      getEthWalletBalance();
    }

    return () => {
      unsubDotBalance && unsubDotBalance();
      unsubEthBalance && unsubEthBalance();
    };
  }, [
    accountAddress,
    api,
    invitationActiveState,
    api && api.query && api.query.tokens,
  ]);

  // Monitor supply balances.
  useEffect(() => {
    let unsubDotSupply = null;
    let unsubEthSupply = null;

    const getDotSupplyBalance = async () => {
      unsubDotSupply = await api.query.floatingRateLend.poolUserSupplies(
        1,
        accountAddress,
        data => {
          if (data.isSome) {
            const dataUnwrap = data.unwrap();
            const amount = fixed32ToNumber(dataUnwrap.amount);
            updateSupply('DOT', amount);
          }
        }
      );
    };
    const getEthSupplyBalance = async () => {
      unsubEthSupply = await api.query.floatingRateLend.poolUserSupplies(
        2,
        accountAddress,
        data => {
          if (data.isSome) {
            const dataUnwrap = data.unwrap();
            const amount = fixed32ToNumber(dataUnwrap.amount);
            updateSupply('ETH', amount);
          }
        }
      );
    };

    if (accountAddress && api && api.query && api.query.floatingRateLend) {
      console.log('floating supply');
      getDotSupplyBalance();
      getEthSupplyBalance();
    }
    return () => {
      unsubDotSupply && unsubDotSupply();
      unsubEthSupply && unsubEthSupply();
    };
  }, [
    api,
    accountAddress,
    invitationActiveState,
    api && api.query && api.query.floatingRateLend,
  ]);

  // Monitor debt balances.
  useEffect(() => {
    let unsubDotDebt = null;
    let unsubEthDebt = null;

    const getDotDebtBalance = async () => {
      unsubDotDebt = await api.query.floatingRateLend.poolUserDebts(
        1,
        accountAddress,
        data => {
          if (data.isSome) {
            const dataUnwrap = data.unwrap();
            const amount = fixed32ToNumber(dataUnwrap.amount);
            updateDebt('DOT', amount);
          }
        }
      );
    };
    const getEthDebtBalance = async () => {
      unsubEthDebt = await api.query.floatingRateLend.poolUserDebts(
        2,
        accountAddress,
        data => {
          if (data.isSome) {
            const dataUnwrap = data.unwrap();
            const amount = fixed32ToNumber(dataUnwrap.amount);
            updateDebt('ETH', amount);
          }
        }
      );
    };

    if (accountAddress && api && api.query && api.query.floatingRateLend) {
      getDotDebtBalance();
      getEthDebtBalance();
    }
    return () => {
      unsubDotDebt && unsubDotDebt();
      unsubEthDebt && unsubEthDebt();
    };
  }, [
    api,
    accountAddress,
    invitationActiveState,
    api && api.query && api.query.floatingRateLend,
  ]);

  // Monitor prices.
  useEffect(() => {
    let unsubDotRoundId = null;
    let unsubEthRoundId = null;

    const getDotPrice = async () => {
      unsubDotRoundId = await api.query.chainlinkFeed.feeds(1, async data => {
        if (!data.isEmpty) {
          let json = JSON.parse(data.toString());
          const lastRoundId = json['latest_round'];
          const priceData = await api.query.chainlinkFeed.rounds(
            1,
            lastRoundId.toString()
          );
          if (priceData.isSome) {
            const unWrappedPriceData = priceData.unwrap();
            updatePrice('DOT', priceToNumber(unWrappedPriceData.answer));
          }
        }
      });
    };
    const getEthPrice = async () => {
      unsubEthRoundId = await api.query.chainlinkFeed.feeds(2, async data => {
        if (!data.isEmpty) {
          let json = JSON.parse(data.toString());
          const lastRoundId = json['latest_round'];
          const priceData = await api.query.chainlinkFeed.rounds(
            2,
            lastRoundId.toString()
          );
          if (priceData.isSome) {
            const unWrappedPriceData = priceData.unwrap();
            updatePrice('ETH', priceToNumber(unWrappedPriceData.answer));
          }
        }
      });
    };

    if (accountAddress && api && api.query && api.query.chainlinkFeed) {
      getDotPrice();
      getEthPrice();
    }
    return () => {
      unsubDotRoundId && unsubDotRoundId();
      unsubEthRoundId && unsubEthRoundId();
    };
  }, [
    api,
    accountAddress,
    invitationActiveState,
    api && api.query && api.query.chainlinkFeed,
  ]);

  // Account address could be null before user link the polkadot extension or
  // doesn't have an account.
  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);

  const renderArrow = () => {
    if (!accountPair) {
      return null;
    }
    if (invitationActiveState !== 'Activated') {
      return null;
    }
    return (
      <img
        className="App-header-arrow"
        src={ArrowImage}
        alt="arrow-right-icon"
      />
    );
  };

  const renderFaucetButton = () => {
    if (!accountPair) {
      return null;
    }
    if (invitationActiveState !== 'Activated') {
      return null;
    }
    return <FaucetButton accountPair={accountPair} />;
  };

  const renderPage = () => {
    if (!accountAddress) {
      return <WelcomePage setAccountAddress={setAccountAddress} />;
    }
    if (apiState == null) {
      console.log('connect substrate');
      connectSubstrate();
      return null;
    } else if (apiState !== 'READY') {
      return <ConnectPage apiState={apiState} />;
    }

    switch (selectedTabItem) {
      case 'Dashboard':
        return (
          <DashboardPage
            accountPair={accountPair}
            setAccountAddress={setAccountAddress}
          />
        );
      case 'Invest':
        return <MarketLists accountPair={accountPair} />;
      default:
        console.log('Invalid tab item. Return dashboard tab by default.');
        return <DashboardPage accountPair={accountPair} />;
    }
  };

  const renderAccountButton = () => {
    if (accountAddress) {
      return (
        <CookiesProvider>
          <AccountButton setAccountAddress={setAccountAddress} />
        </CookiesProvider>
      );
    }
    return null;
  };

  const contextRef = createRef();

  return (
    <div className="App-container" ref={contextRef}>
      <div className="App-content-container">
        <div className="App-header">
          <div className="App-header-logo">
            <AppLogo />
          </div>
          <TabBar onChangeTabItemName={setSelectedTabItem} />
          <div className="App-header-middle"></div>
          {renderAccountButton()}
          {renderArrow()}
          {renderFaucetButton()}
        </div>
        <div className="App-watermark">
          <img
            className="App-watermark-image"
            src={Watermark}
            alt="watermark-img"
          />
        </div>
        <div className="App-oval-box">
          <div className="App-oval-background"></div>
        </div>
        {renderPage()}
      </div>
    </div>
  );
}

const mapDispatchToProps = {
  updateWalletBalance: walletAction.UPDATE_WALLET_BALANCE,
  updateSupply: marketAction.UPDATE_SUPPLY,
  updateDebt: marketAction.UPDATE_SUPPLY,
  updatePrice: marketAction.UPDATE_PRICE,
  updateLiquidationThreshold: marketAction.UPDATE_LIQUIDATION_THRESHOLD,
};

const MainContainer = connect(() => {}, mapDispatchToProps)(Main);

export default function App() {
  return (
    <SubstrateContextProvider>
      <MainContainer />
    </SubstrateContextProvider>
  );
}
