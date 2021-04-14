import React, { useState, useEffect, createRef } from 'react';
import { CookiesProvider } from 'react-cookie';

import { ReactComponent as AppLogo } from 'resources/icons/AppLogo.svg';
import { AccountButton, FaucetButton, TabBar } from 'components';
import { TAB_NAME_ARRAY } from 'components/Tabbar/TabBar';
import { ConnectPage, DashboardPage, MarketLists, WelcomePage } from 'screens';
import { fixed32ToNumber, balanceToUnitNumber } from 'utils/numberUtils';
import ArrowImage from 'resources/img/arrow_right.png';
import { SubstrateContextProvider, useSubstrate } from 'services/substrate-lib';
import Watermark from 'resources/img/watermark_new.png';
import { fetchUserInfo } from 'services/user-balance';

import 'semantic-ui-css/semantic.min.css';
import './App.scss';

function Main() {
  const [accountAddress, setAccountAddress] = useState(null);
  const [selectedTabItem, setSelectedTabItem] = useState(TAB_NAME_ARRAY[0]);
  const {
    api,
    apiError,
    apiState,
    keyring,
    keyringState,
    connectSubstrate,
  } = useSubstrate();
  const { invitationActiveState, verifyInvitation } = useSubstrate();
  const [accountBalance, setAccountBalance] = useState({
    supplyBalance: null,
    borrowLimit: null,
    debtBalance: null,
  });
  const [threshold, setThreshold] = useState(null);

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
    let interval = null;
    console.log(
      'before condition: ' + invitationActiveState + ' ' + accountAddress
    );
    if (accountAddress && invitationActiveState === 'Activated' && api) {
      interval = setInterval(async () => {
        console.log(
          'wow, fetch user info:' + invitationActiveState + ' ' + accountAddress
        );
        fetchUserInfo(setAccountBalance, accountAddress);
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [api, accountAddress, invitationActiveState]);

  useEffect(() => {
    let unsubThreshold = null;

    if (invitationActiveState === 'Activated' && api && api.query.lending) {
      const getThreshold = async () => {
        unsubThreshold = await api.query.lending.liquidationThreshold(data => {
          if (data) {
            setThreshold(fixed32ToNumber(data));
          }
        });
      };
      getThreshold();
    }
    return () => unsubThreshold && unsubThreshold();
  }, [invitationActiveState, api]);

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
            accountBalance={accountBalance}
            setAccountAddress={setAccountAddress}
            liquidationThreshold={threshold}
          />
        );
      case 'Invest':
        return (
          <MarketLists
            accountPair={accountPair}
            accountBalance={accountBalance}
            setAccountAddress={setAccountAddress}
            liquidationThreshold={threshold}
          />
        );
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

export default function App() {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  );
}
