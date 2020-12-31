import React, { useState, createRef } from 'react';
import { Dimmer, Loader, Grid, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import { SubstrateContextProvider, useSubstrate } from './substrate-lib';

import AccountBalance from './AccountBalance';
import AccountSelector from './AccountSelector';
import MarketLists from './MarketLists';
import './App.css';

import KonomiImage from './resources/img/KONO.png';

function Main () {
  const [accountAddress, setAccountAddress] = useState(null);
  const { apiState, keyring, keyringState, apiError } = useSubstrate();
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

  if (keyringState !== 'READY') {
    return loader('Loading accounts (please review any extension\'s authorization)');
  }

  const contextRef = createRef();

  return (
    <div className="App-container" ref={contextRef}>
      <div className="App-content-container">
        <div className="App-header">
          <img className="App-header-img" src={KonomiImage} alt="konomi-logo" />
          <p className="App-header-title">Konomi</p>
          <div className="App-header-middle"></div>
          <AccountSelector setAccountAddress={setAccountAddress} />
        </div>
        <AccountBalance accountPair={accountPair} />
        <MarketLists accountPair={accountPair} />
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
