import React, { useContext, useState } from 'react';

function useWalletStates () {
  const [prices, setPrices] = useState({'0': 0, '1': 0, '2': 0, '3': 0, '4': 0});
  const [balances, setBalances] = useState({'0': 0, '1': 0, '2': 0, '3': 0, '4': 0});
  return { prices, setPrices, balances, setBalances };
}

const WalletContext = React.createContext();

const WalletContextProvider = (props) => {
  return <WalletContext.Provider value={useWalletStates()}>
    {props.children}
  </WalletContext.Provider>;
};

const useWallet = () => ({ ...useContext(WalletContext) });

export { WalletContextProvider, useWallet };
