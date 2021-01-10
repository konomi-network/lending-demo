import React, { useEffect, useState } from 'react';

import { balanceToUnitNumber, numberToReadableString } from '../numberUtils';
import { useSubstrate } from '../substrate-lib';
import KonomiImage from '../resources/img/KONO.png';
import DotImage from '../resources/img/DOT.png';
import KsmImage from '../resources/img/KSM.png';
import EthImage from '../resources/img/ETH.png';
import BtcImage from '../resources/img/BTC.png';
import WalletAssetRow from './WalletAssetRow';

import './Wallet.css';
import './WalletAssetRow.css';

const INIT_ASSET_LIST = [
  { id: 0, name: 'Konomi', abbr: 'KONO', image: KonomiImage, balance: null, price: 100 },
  { id: 1, name: 'Polkadot', abbr: 'DOT', image: DotImage, balance: null, price: 60 },
  { id: 2, name: 'Kusama', abbr: 'KSM', image: KsmImage, balance: null, price: 5 },
  { id: 3, name: 'Ethereum', abbr: 'ETH', image: EthImage, balance: null, price: 600 },
  { id: 4, name: 'Bitcoin', abbr: 'BTC', image: BtcImage, balance: null, price: 20000 }
];

export default function Main (props) {
  const { accountPair } = props;

  const { api } = useSubstrate();

  const [assetList, setAssetList] = useState({value: INIT_ASSET_LIST});

  useEffect(() => {
    let interval = null;
    // let unsubAsset1 = null;
    // let unsubAsset2 = null;
    // let unsubAsset3 = null;
    // let unsubAsset4 = null;
    // let unsubAsset5 = null;

    if (accountPair != null) {
      const getAsset = async () => {
        let needUpdateState = false;
        const currentAssetList = assetList.value;
        const assetBalanceArray = await Promise.all(
          INIT_ASSET_LIST.map((asset) =>
            api.query.assets.balances([asset.id, accountPair.address])
          )
        );
        for (let assetId = 0; assetId < assetBalanceArray.length; assetId++) {
          const newBalance = balanceToUnitNumber(assetBalanceArray[assetId]);
          const currentBalance = currentAssetList[assetId].balance;
          if (currentBalance == null || currentBalance != newBalance) {
            currentAssetList[assetId].balance = newBalance;
            needUpdateState = true;
          }
        }
        if (needUpdateState) {
          setAssetList({value: currentAssetList});
        }
      };
      // getAsset();
      interval = setInterval(() => {
        getAsset();
      }, 5000);
    }

    return () => {
      console.log('clear');
      clearInterval(interval);
    };
  }, [api.query.assets, accountPair]);

  const renderTableRows = () => {
    const tableRows = assetList.value.map((asset) => {
      if (!asset.balance || asset.balance == 0) {
        return null;
      }
      return (<WalletAssetRow rowData={asset} key={asset.id} />)
    });
    return tableRows;
  }

  const renderAssetTable = () => {
    let isTableEmply = true;
    for (let index in assetList.value) {
      const asset = assetList.value[index];
      if (!!asset.balance) {
        isTableEmply = false;
        break;
      }
    }
    if (isTableEmply) {
      return null;
    }
    return (
      <div className="Wallet-asset-table">
        <div className="Wallet-asset-table-header">
          <div className="WalletAssetRow-column-asset">
            <p className="Wallet-asset-table-header-text">Asset</p>
          </div>
          <div className="WalletAssetRow-column-balance">
            <p className="Wallet-asset-table-header-text">Balance</p>
          </div>
          <div className="WalletAssetRow-column-price">
            <p className="Wallet-asset-table-header-text">Price</p>
          </div>
          <div className="WalletAssetRow-column-value">
            <p className="Wallet-asset-table-header-text">Value</p>
          </div>
        </div>
        {renderTableRows()}
      </div>
    );
  }

  // Recalculate the wallet balance before each re-render cycle.
  let newWalletBalance = 0;
  for (var asset of assetList.value) {
    newWalletBalance += asset.balance * asset.price;
  }

  return (
    <div className="Wallet-container">
      <div className="Wallet-total">
        <p className="Wallet-total-label">Wallet</p>
        <p className="Wallet-total-number">${numberToReadableString(newWalletBalance)}</p>
      </div>
      {renderAssetTable()}
    </div>
  );
}
