import React, { useEffect, useState } from 'react';

import { balanceToUnitNumber, numberToReadableString, fixed32ToNumber } from '../numberUtils';
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
    let unsubPool0 = null;
    let unsubPool1 = null;
    let unsubPool2 = null;
    let unsubPool3 = null;
    let unsubPool4 = null;
    const getPool = async () => {
      unsubPool0 = await api.query.assets.price(0, (price) => {
        if (price) {
          const newPrice = fixed32ToNumber(price);
          const list = assetList.value;
          if (newPrice !== list[0].price) {
            list[0].price = newPrice;
            setAssetList({value: list});
          }
        }
      });
      unsubPool1 = await api.query.assets.price(1, (price) => {
        if (price) {
          const newPrice = fixed32ToNumber(price);
          const list = assetList.value;
          if (newPrice !== list[1].price) {
            list[1].price = newPrice;
            setAssetList({value: list});
          }
        }
      });
      unsubPool2 = await api.query.assets.price(2, (price) => {
        if (price) {
          const newPrice = fixed32ToNumber(price);
          const list = assetList.value;
          if (newPrice !== list[2].price) {
            list[2].price = newPrice;
            setAssetList({value: list});
          }
        }
      });
      unsubPool3 = await api.query.assets.price(3, (price) => {
        if (price) {
          const newPrice = fixed32ToNumber(price);
          const list = assetList.value;
          if (newPrice !== list[3].price) {
            list[3].price = newPrice;
            setAssetList({value: list});
          }
        }
      });
      unsubPool4 = await api.query.assets.price(4, (price) => {
        if (price) {
          const newPrice = fixed32ToNumber(price);
          const list = assetList.value;
          if (newPrice !== list[4].price) {
            list[4].price = newPrice;
            setAssetList({value: list});
          }
        }
      });
    }
    getPool();

    let unsubAsset0 = null;
    let unsubAsset1 = null;
    let unsubAsset2 = null;
    let unsubAsset3 = null;
    let unsubAsset4 = null;

    if (accountPair != null) {
      const getAsset = async () => {
        unsubAsset0 =
          await api.query.assets.balances([0, accountPair.address], (balance) => {
            const newBalance = balanceToUnitNumber(balance);
            const list = assetList.value;
            if (newBalance !== list[0].balance) {
              list[0].balance = newBalance;
              setAssetList({value: list});
            }
          });
        unsubAsset1 =
          await api.query.assets.balances([1, accountPair.address], (balance) => {
            const newBalance = balanceToUnitNumber(balance);
            const list = assetList.value;
            if (newBalance !== list[1].balance) {
              list[1].balance = newBalance;
              setAssetList({value: list});
            }
          });
        unsubAsset2 =
          await api.query.assets.balances([2, accountPair.address], (balance) => {
            const newBalance = balanceToUnitNumber(balance);
            const list = assetList.value;
            if (newBalance !== list[2].balance) {
              list[2].balance = newBalance;
              setAssetList({value: list});
            }
          });
        unsubAsset3 =
          await api.query.assets.balances([3, accountPair.address], (balance) => {
            const newBalance = balanceToUnitNumber(balance);
            const list = assetList.value;
            if (newBalance !== list[3].balance) {
              list[3].balance = newBalance;
              setAssetList({value: list});
            }
          });
        unsubAsset4 =
          await api.query.assets.balances([4, accountPair.address], (balance) => {
            const newBalance = balanceToUnitNumber(balance);
            const list = assetList.value;
            if (newBalance !== list[4].balance) {
              list[4].balance = newBalance;
              setAssetList({value: list});
            }
          });
      };
      getAsset();
    }

    return () => {
      unsubPool0 && unsubPool0();
      unsubPool1 && unsubPool1();
      unsubPool2 && unsubPool2();
      unsubPool3 && unsubPool3();
      unsubPool4 && unsubPool4();
      unsubAsset0 && unsubAsset0();
      unsubAsset1 && unsubAsset1();
      unsubAsset2 && unsubAsset2();
      unsubAsset3 && unsubAsset3();
      unsubAsset4 && unsubAsset4();
    };
  }, [api.query.assets, accountPair, assetList.value]);

  const renderTableRows = () => {
    const tableRows = assetList.value.map((asset) => {
      if (!asset.balance || asset.balance === 0) {
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
