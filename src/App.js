import React, { useState, createRef } from 'react';
import { Dimmer, Loader, Grid, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { CookiesProvider } from 'react-cookie';

import { SubstrateContextProvider, useSubstrate } from './substrate-lib';

import AccountBalance from './AccountBalance';
import AccountButton from './AccountButton';
import AccountSelector from './AccountSelector';
import { DashboardPage } from './dashboard';
import ExchangePage from './ExchangePage';
import FaucetButton from './FaucetButton';
import TransactionsPage from './TransactionsPage';
import { MarketLists } from './invest';
import TabBar from './TabBar';
import './App.css';

import KonomiImage from './resources/img/KONO.png';

function Main () {
  const [accountAddress, setAccountAddress] = useState(null);

  // The tab name array is defined in TabBar.js.
  const [selectedTabItem, setSelectedTabItem] = useState("Dashboard");
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
  const { loadAccounts } = useSubstrate();

  const accountPair =
    accountAddress &&
    keyringState === 'READY' &&
    keyring.getPair(accountAddress);

  const loader = text =>
    <Dimmer active>
      <Loader size='small'>{text}</Loader>
    </Dimmer>;

  const message = err =>
    <Grid centered columns={2} padded>
      <Grid.Column>
        <Message negative compact floating
          header='Error Connecting to Substrate'
          content={`${JSON.stringify(err, null, 4)}`}
        />
      </Grid.Column>
    </Grid>;

  if (apiState === 'ERROR') return message(apiError);
  else if (apiState !== 'READY') return loader('Connecting to Substrate');

  // if (keyringState !== 'READY') {
  //   return loader('Loading accounts (please review any extension\'s authorization)');
  // }

  const contextRef = createRef();

  const renderPage = () => {
    switch (selectedTabItem) {
      case "Dashboard":
        return <DashboardPage accountPair={accountPair} />;
      case "Invest":
        return (
          <div>
            <MarketLists accountPair={accountPair} />
          </div>
        );
      case "Exchange":
        return <ExchangePage />;
      case "Transactions":
        return <TransactionsPage />;
      default:
        return <ExchangePage />;
    }
  }

  return (
    <div className="App-container" ref={contextRef}>
      <div className="App-content-container">
        <div className="App-header">
          <img className="App-header-img" src={KonomiImage} alt="konomi-logo" />
          <p className="App-header-title">KONOMI</p>
          <div className="App-header-middle"></div>
          <CookiesProvider>
            <AccountButton setAccountAddress={setAccountAddress} />
          </CookiesProvider>
          <FaucetButton accountPair={accountPair} />
        </div>
        <TabBar onChangeTabItemName={setSelectedTabItem} />
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
