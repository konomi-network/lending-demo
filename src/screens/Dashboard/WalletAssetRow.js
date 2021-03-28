import React, { useEffect, useState } from 'react';

import { fixed32ToNumber, balanceToUnitNumber, numberToReadableString } from 'utils/numberUtils';
import { useSubstrate } from 'services/substrate-lib';
import { useWallet } from './WalletContext';

import './WalletAssetRow.css';

export default function Main (props) {
  const { rowData } = props;
  const { assetId, accountPair } = props;

  const [supplyBalance, setSupplyBalance] = useState(0);
  const [borrowBalance, setBorrowBalance] = useState(0);
  const [price, setPrice] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);

  const { prices, setPrices, balances, setBalances} = useWallet();

  const { api } = useSubstrate();

  useEffect(() => {
    let unsubPrice = null;
    const getPrice = async () => {
      unsubPrice = await api.query.assets.price(assetId, (price) => {
        if (price) {
          const newPrice = fixed32ToNumber(price);
          if (newPrice !== price) {
            setPrice(newPrice);
            const newPriceList = prices;
            newPriceList[assetId] = newPrice;
            setPrices(newPriceList);
          }
        }
      });
    }
    getPrice();

    let unsubAsset = null;
    let unsubBorrow = null;
    let unsubSupply = null;
    if (accountPair != null) {
      const getAsset = async () => {
        unsubAsset =
          await api.query.assets.balances([assetId, accountPair.address], (balance) => {
            const newBalance = balanceToUnitNumber(balance);
            if (newBalance !== walletBalance) {
              setWalletBalance(newBalance);
              const newBalanceList = balances;
              newBalanceList[assetId] = newBalance;
              setBalances(newBalanceList);
            }
          });
      };
      getAsset();

      const getCurrentSupply = async () => {
        unsubSupply = await api.query.lending.userSupplies(assetId, accountPair.address, userData => {
          if (userData.isSome) {
            const dataUnwrap = userData.unwrap();
            setSupplyBalance(balanceToUnitNumber(dataUnwrap.amount));
          } else {
            setSupplyBalance(0);
          }
        });
      };
      getCurrentSupply();

      const getCurrentBorrow = async () => {
        unsubBorrow = await api.query.lending.userDebts(assetId, accountPair.address, userData => {
          if (userData.isSome) {
            const dataUnwrap = userData.unwrap();
            setBorrowBalance(balanceToUnitNumber(dataUnwrap.amount));
          } else {
            setBorrowBalance(0);
          }
        });
      };
      getCurrentBorrow();
    }

    return () => {
      unsubPrice && unsubPrice();
      unsubAsset && unsubAsset();
      unsubSupply && unsubSupply();
      unsubBorrow && unsubBorrow();
    };
  }, [api.query.assets, api.query.lending, assetId, accountPair]);

  const assetValue = walletBalance * price;

  return (
    <div className="WalletAssetRow-container">
      <div className="WalletAssetRow-column-asset WalletAssetRow-cell">
        <img className="WalletAssetRow-asset-icon" src={rowData.image} alt="asset-icon" />
        <p className="WalletAssetRow-asset-text">{rowData.abbr}</p>
      </div>
      <div className="WalletAssetRow-column-supply-balance">
        <p className="WalletAssetRow-number">{numberToReadableString(supplyBalance)}</p>
      </div>
      <div className="WalletAssetRow-column-borrow-balance">
        <p className="WalletAssetRow-number">{numberToReadableString(borrowBalance)}</p>
      </div>
      <div className="WalletAssetRow-column-wallet-balance">
        <p className="WalletAssetRow-number">{numberToReadableString(walletBalance)}</p>
      </div>
      <div className="WalletAssetRow-column-price">
        <p className="WalletAssetRow-number">${price}</p>
      </div>
      <div className="WalletAssetRow-column-value">
        <p className="WalletAssetRow-number">${numberToReadableString(assetValue, true)}</p>
      </div>
    </div>
  );
}