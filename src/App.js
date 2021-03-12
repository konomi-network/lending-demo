import React, { useState, useEffect, createRef } from 'react';
import { Dimmer, Loader, Grid, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { CookiesProvider } from 'react-cookie';

import AccountButton from './AccountButton';
import AppLogo from './AppLogo';
import FaucetButton from './FaucetButton';
import { TabBar, TAB_NAME_ARRAY } from './TabBar';
import { DashboardPage } from './dashboard';
import { ExchangePage } from './exchange';
import { MarketLists } from './invest';
import { fixed32ToNumber, balanceToUnitNumber } from './numberUtils';
import ArrowImage from './resources/img/arrow_right.png';
import { SubstrateContextProvider, useSubstrate } from './substrate-lib';
import { TransactionsPage } from './transactions';

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
    return (
      <img className="App-header-arrow" src={ArrowImage} alt="arrow-right-icon" />
    );
  }

  const renderPage = () => {
    switch (selectedTabItem) {
      case "Dashboard":
        return <DashboardPage accountPair={accountPair} accountBalance={accountBalance} />;
      case "Invest":
        return <MarketLists accountPair={accountPair} />;
      // case "Exchange":
      //   return <ExchangePage />;
      // case "Transactions":
      //   return <TransactionsPage />;
      default:
        console.log("Invalid tab item. Return dashboard tab by default.");
        return <DashboardPage accountPair={accountPair} />;
    }
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
          <CookiesProvider>
            <AccountButton setAccountAddress={setAccountAddress} />
          </CookiesProvider>
          {renderArrow()}
          <FaucetButton accountPair={accountPair} />
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
