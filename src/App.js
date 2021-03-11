import React, { useState, useEffect, createRef } from 'react';
import { Dimmer, Loader, Grid, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import { CookiesProvider } from 'react-cookie';

import AccountButton from './AccountButton';
import FaucetButton from './FaucetButton';
import { TabBar, TAB_NAME_ARRAY } from './TabBar';
import { DashboardPage } from './dashboard';
import { ExchangePage } from './exchange';
import { MarketLists } from './invest';
import { fixed32ToNumber, balanceToUnitNumber } from './numberUtils';
import { SubstrateContextProvider, useSubstrate } from './substrate-lib';
import { TransactionsPage } from './transactions';

import './App.css';

import KonomiImage from './resources/img/KONO.png';

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
      if (accountAddress && invitationActiveState === 'Activiated' && api && api.rpc.lending) {
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

    if (invitationActiveState === 'Activiated' && api && api.query.lending) {
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
    if (invitationActiveState !== 'Activiated') {
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
            <svg width="75" height="76" viewBox="0 0 75 76" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M33.6475 23.1778C39.7717 23.1778 44.7364 18.2131 44.7364 12.0889C44.7364 5.96467 39.7717 1 33.6475 1C27.5233 1 22.5586 5.96467 22.5586 12.0889C22.5586 18.2131 27.5233 23.1778 33.6475 23.1778Z" fill="white" stroke="white" stroke-width="0.161779" stroke-miterlimit="10"/>
            <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="48" y="27" width="24" height="24">
            <path d="M60.1172 50.0918C66.2414 50.0918 71.2061 45.1272 71.2061 39.003C71.2061 32.8787 66.2414 27.9141 60.1172 27.9141C53.993 27.9141 49.0283 32.8787 49.0283 39.003C49.0283 45.1272 53.993 50.0918 60.1172 50.0918Z" fill="#3650FA" stroke="#FFE500" stroke-width="0.161779" stroke-miterlimit="10"/>
            </mask>
            <g mask="url(#mask0)">
            <path d="M63.6006 59.3621L18.8867 14.6465" stroke="white" stroke-width="1.13245" stroke-miterlimit="10"/>
            <path d="M67.3906 59.3621L22.6768 14.6465" stroke="white" stroke-width="1.13245" stroke-miterlimit="10"/>
            <path d="M71.1797 59.3621L26.4658 14.6465" stroke="white" stroke-width="1.13245" stroke-miterlimit="10"/>
            <path d="M74.9697 59.3621L30.2559 14.6465" stroke="white" stroke-width="1.13245" stroke-miterlimit="10"/>
            <path d="M78.7598 59.3621L34.0459 14.6465" stroke="white" stroke-width="1.13245" stroke-miterlimit="10"/>
            <path d="M82.5498 59.3621L37.8359 14.6465" stroke="white" stroke-width="1.13245" stroke-miterlimit="10"/>
            <path d="M86.3399 59.3621L41.626 14.6465" stroke="white" stroke-width="1.13245" stroke-miterlimit="10"/>
            <path d="M90.1309 59.3621L45.417 14.6465" stroke="white" stroke-width="1.13245" stroke-miterlimit="10"/>
            <path d="M93.919 59.3621L49.2051 14.6465" stroke="white" stroke-width="1.13245" stroke-miterlimit="10"/>
            <path d="M97.71 59.3621L52.9961 14.6465" stroke="white" stroke-width="1.13245" stroke-miterlimit="10"/>
            <path d="M101.499 59.3621L56.7852 14.6465" stroke="white" stroke-width="1.13245" stroke-miterlimit="10"/>
            </g>
            <path d="M0.988532 23.9274C0.770995 23.9274 0.391793 23.8513 0.239516 23.699C0.08724 23.5467 0.0111017 23.156 0.0111017 22.9385L0 2.35562C0 1.95425 0.0719056 1.66726 0.25937 1.4383C0.474242 1.17585 0.806687 1.08594 1.17967 1.08594H3.45986C3.82772 1.08594 4.02556 1.23557 4.20126 1.4383C4.37696 1.64102 4.4815 1.95425 4.4815 2.3496V9.30257C4.4815 9.38672 4.58449 9.42745 4.64206 9.36607L11.856 1.67329C11.943 1.56452 12.0844 1.44488 12.2802 1.31435C12.4978 1.16208 12.7806 1.08594 13.1286 1.08594H16.359C16.5331 1.08594 16.6854 1.1512 16.8159 1.28172C16.9682 1.41225 17.0443 1.5754 17.0443 1.77118C17.0443 1.92346 17.0008 2.05398 16.9138 2.16275L7.99656 11.9555C7.96459 11.9906 7.96426 12.0441 7.99579 12.0796L17.5338 22.818C17.6425 22.9485 17.6969 23.0899 17.6969 23.2422C17.6969 23.4379 17.6208 23.6011 17.4685 23.7316C17.338 23.8621 17.1857 23.9274 17.0117 23.9274H13.6507C13.2809 23.9274 12.9872 23.8513 12.7697 23.699C12.5739 23.525 12.4434 23.4053 12.3781 23.34L4.64289 14.8696C4.58574 14.8071 4.4815 14.8475 4.4815 14.9322V22.9389C4.4815 23.1564 4.35354 23.528 4.20126 23.6803C4.04899 23.8325 3.69915 23.9274 3.45986 23.9274L0.988532 23.9274Z" fill="white"/>
            <path d="M26.0561 51.111C25.7694 51.111 25.4327 51.0272 25.2203 50.8148C25.008 50.6025 24.9541 50.3417 24.9541 50.1242L24.9541 29.3636C24.9541 29.1243 24.9788 28.8265 25.1795 28.6258C25.3802 28.4251 25.7363 28.2695 25.9538 28.2695H28.1763C28.4809 28.2695 28.6782 28.3626 28.8637 28.4896C29.0491 28.6165 29.1879 28.8021 29.2314 28.8674L38.1665 42.7465C38.2918 42.9412 38.5937 42.8525 38.5937 42.6209V29.3713C38.5937 29.0724 38.6502 28.8343 38.8181 28.6427C38.986 28.4511 39.1958 28.2861 39.539 28.2695H42.0136C42.3007 28.2695 42.5738 28.4193 42.735 28.6401C42.8659 28.8193 42.9336 29.0666 42.9336 29.361V50.1307C42.9336 50.37 42.819 50.6386 42.6667 50.7909C42.5144 50.9432 42.278 51.111 42.014 51.111H39.7159C39.4114 51.111 39.1599 51.0338 39.0267 50.943C38.8935 50.8523 38.7429 50.6824 38.6734 50.5916C38.6128 50.5126 31.5398 39.723 29.718 36.9436C29.5916 36.7508 29.294 36.8436 29.294 37.0741V50.1248C29.294 50.3423 29.3002 50.5714 29.0239 50.8412C28.7476 51.111 28.4228 51.111 28.1835 51.111H26.0561Z" fill="white"/>
            <path d="M48.1813 75.6387C47.9894 75.6387 47.8167 75.5715 47.6632 75.4372C47.5289 75.2837 47.4617 75.111 47.4617 74.9191V56.2109C47.4617 55.9998 47.5289 55.8271 47.6632 55.6928C47.8167 55.5585 47.9894 55.4913 48.1813 55.4913H51.2897C51.7502 55.4913 52.086 55.7024 52.2971 56.1245L57.3627 65.1908L62.4283 56.1245C62.6394 55.7024 62.9752 55.4913 63.4357 55.4913H66.5154C66.7264 55.4913 66.8991 55.5585 67.0334 55.6928C67.1869 55.8271 67.2637 55.9998 67.2637 56.2109V74.9191C67.2637 75.1302 67.1869 75.3029 67.0334 75.4372C66.8991 75.5715 66.7264 75.6387 66.5154 75.6387H63.0903C62.8792 75.6387 62.697 75.5715 62.5435 75.4372C62.4091 75.3029 62.342 75.1302 62.342 74.9191V64.1259L59.1184 70.1413C58.869 70.5826 58.5332 70.8033 58.111 70.8033H56.6144C56.3649 70.8033 56.1635 70.7457 56.01 70.6306C55.8565 70.5155 55.7221 70.3524 55.607 70.1413L52.3546 64.1259V74.9191C52.3546 75.111 52.2875 75.2837 52.1532 75.4372C52.0189 75.5715 51.8462 75.6387 51.6351 75.6387H48.1813Z" fill="white"/>
            <path d="M70.0707 75.623C69.8788 75.623 69.7061 75.5559 69.5525 75.4216C69.4182 75.268 69.351 75.0953 69.351 74.9034V56.1933C69.351 55.9822 69.4182 55.8095 69.5525 55.6751C69.7061 55.5408 69.8788 55.4736 70.0707 55.4736H73.9278C74.1389 55.4736 74.3116 55.5408 74.446 55.6751C74.5995 55.8095 74.6762 55.9822 74.6762 56.1933V74.9034C74.6762 75.1145 74.5995 75.2872 74.446 75.4216C74.3116 75.5559 74.1389 75.623 73.9278 75.623H70.0707Z" fill="white"/>
            </svg>
          </div>
          <TabBar onChangeTabItemName={setSelectedTabItem} />
          <div className="App-header-middle"></div>
          <CookiesProvider>
            <AccountButton setAccountAddress={setAccountAddress} />
          </CookiesProvider>
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
