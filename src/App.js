import React, { useState, useEffect, createRef } from 'react';
import { Dimmer, Loader, Grid, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { CookiesProvider } from 'react-cookie';

import AccountButton from 'components/Account/AccountButton';
import AppLogo from 'components/App/AppLogo';
import FaucetButton from 'components/Faucet/FaucetButton';
import { TabBar, TAB_NAME_ARRAY } from 'components/Tabbar/TabBar';
import DashboardPage from 'screens/Dashboard/DashboardPage';
import MarketLists from 'screens/Invest/MarketLists';
import { fixed32ToNumber, balanceToUnitNumber } from 'utils/numberUtils';
import ArrowImage from 'resources/img/arrow_right.png';
import { SubstrateContextProvider, useSubstrate } from 'services/substrate-lib';
import Watermark from 'resources/img/watermark_new.png';

import './App.css';

function Main () {
  const [accountAddress, setAccountAddress] = useState(null);
  const [selectedTabItem, setSelectedTabItem] = useState(TAB_NAME_ARRAY[0]);
  const { api, apiError, apiState, keyring, keyringState } = useSubstrate();
  const { invitationActiveState, verifyInvitation } = useSubstrate();
  const [accountBalance, setAccountBalance] = useState({
    supplyBalance: null,
    borrowLimit: null,
    debtBalance: null,
  })
  const [threshold, setThreshold] = useState(null);

  useEffect(() => {
    if (invitationActiveState == null && accountAddress) {
      const addressList = 
        keyring.getPairs().filter(account => account.meta.isInjected)
        .map(account => account.address);
      verifyInvitation(addressList);
    }
  }, [invitationActiveState, keyring, accountAddress]);

  useEffect(() => {
    const interval = setInterval( async () => {
      if (accountAddress && invitationActiveState === 'Activated' && api && api.rpc.lending) {
        const userData = await api.rpc.lending.getUserInfo(accountPair.address);
        const [supplyBalance, borrowLimit, debtBalance] = userData;
        // TODO: Always update since the accountBalance is not binded.
        const isSame = (supplyBalance === accountBalance.supplyBalance) ||
            (borrowLimit === accountBalance.borrowLimit) ||
            (debtBalance === accountBalance.debtBalance);
        if (!isSame) {
          setAccountBalance({
            supplyBalance: balanceToUnitNumber(supplyBalance),
            borrowLimit: balanceToUnitNumber(borrowLimit),
            debtBalance: balanceToUnitNumber(debtBalance),
          });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [accountAddress, invitationActiveState]);

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

  const loader = text =>
    <Dimmer active>
      <Loader size='small'>{text}</Loader>
    </Dimmer>;

  const message = err =>
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message negative compact floating
          header='Error Connecting to server'
          content={`${JSON.stringify(err, null, 4)}`}
        />
      </Grid.Column>
    </Grid>;

  if (apiState === 'ERROR') return message(apiError);
  else if (apiState !== 'READY') return loader('Connecting...');

  // Account address could be null before user link the polkadot extension or
  // doesn't have an account.
  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);

  const renderLiquidationAlert = () => {
    if (!accountPair || !accountPair.address) {
      return null;
    }
    if (invitationActiveState !== 'Activated') {
      return null;
    }
    if (accountBalance.borrowLimit == null ||
        accountBalance.debtBalance == null ||
        threshold == null) {
      return null;
    }
    if (accountBalance.debtBalance > accountBalance.borrowLimit / threshold) {
      return (
        <Message negative>
          <p>Warning. Liquidation is triggered. Please repay your debt to avoid liquidation.</p>
        </Message>
      );
    }
  }

  const renderArrow = () => {
    if (!accountPair) {
      return null;
    }
    if (invitationActiveState !== 'Activated') {
      return null;
    }
    return (
      <img className="App-header-arrow" src={ArrowImage} alt="arrow-right-icon" />
    );
  }

  const renderFaucetButton = () => {
    if (!accountPair) {
      return null;
    }
    if (invitationActiveState !== 'Activated') {
      return null;
    }
    return (
      <FaucetButton accountPair={accountPair} />
    );
  }

  const renderPage = () => {
    switch (selectedTabItem) {
      case "Dashboard":
        return (
          <DashboardPage
            accountPair={accountPair}
            accountBalance={accountBalance}
            setAccountAddress={setAccountAddress}
            liquidationThreshold={threshold} />
        );
      case "Invest":
        return (
          <MarketLists
            accountPair={accountPair}
            accountBalance={accountBalance}
            setAccountAddress={setAccountAddress}
            liquidationThreshold={threshold} />
        ); 
      default:
        console.log("Invalid tab item. Return dashboard tab by default.");
        return <DashboardPage accountPair={accountPair} />;
    }
  }

  const renderAccountButton = () => {
    if (accountAddress) {
      return (
        <CookiesProvider>
          <AccountButton setAccountAddress={setAccountAddress} />
        </CookiesProvider>
      );
    }
    return null;
  }

  const contextRef = createRef();

  return (
    <div className="App-container" ref={contextRef}>
      <div className="App-content-container">
        {renderLiquidationAlert()}
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
        <div className="App-watermark" >
          <img className="App-watermark-image" src={Watermark} alt='watermark-img' />
        </div>
        <div className="App-oval-box">
          <div className="App-oval-background"></div>
        </div>
        {renderPage()}
      </div>
    </div>
  );
}

export default function App () {
  return (
    <SubstrateContextProvider>
      <Main />
    </SubstrateContextProvider>
  );
}
