import React, { useEffect, useState } from 'react';
import { Checkbox } from 'semantic-ui-react';

import { useSubstrate } from '../substrate-lib';
import { balanceToAPY, balanceToUnitNumber, numberToReadableString } from '../numberUtils';
import KonomiImage from '../resources/img/KONO.png';
import DotImage from '../resources/img/DOT.png';
import KsmImage from '../resources/img/KSM.png';
import EthImage from '../resources/img/ETH.png';
import BtcImage from '../resources/img/BTC.png';

import './SupplyMarketRow.css';

const SUPPLY_ASSET_LIST = [
  { id: 0, name: 'Konomi', abbr: 'KONO', image: KonomiImage, apy: 0.0002, price: 100 },
  { id: 1, name: 'Polkadot', abbr: 'DOT', image: DotImage, apy: 0.0204, price: 60 },
  { id: 2, name: 'Kusama', abbr: 'KSM', image: KsmImage, apy: 0.039, price: 5 },
  { id: 3, name: 'Ethereum', abbr: 'ETH', image: EthImage, apy: 0.0004, price: 600 },
  { id: 4, name: 'Bitcoin', abbr: 'BTC', image: BtcImage, apy: 0.0078, price: 20000 }
];

const moneyBase = 1000000000000;

export default function Main (props) {
  const { accountPair, rowId, onClickSupplyMarketRow } = props;

  const { api } = useSubstrate();

  const [apy, setAPY] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    let unsubAPY = null;
    let unsubWallet = null;
    const assetId = rowId;

    if (assetId != null) {
      const getSupplyAPY = async () => {
        unsubAPY = await api.query.lending.pools(assetId, assetPool => {
          if (assetPool.isSome) {
            const unwrappedPool = assetPool.unwrap();
            const apyNumber = balanceToAPY(unwrappedPool.supplyAPY);
            setAPY(apyNumber);
          } else {
            setAPY(0);
          }
        });
      };
      getSupplyAPY();

      if (accountPair) {
        const getSupplyWallet = async () => {
          unsubWallet = await api.query.assets.balances([assetId, accountPair.address], balance => {
            const balanceNum = balanceToUnitNumber(balance);
            setWalletBalance(numberToReadableString(balanceNum));
          });
        };
        getSupplyWallet();
      }
    }

    return () => {
      unsubAPY && unsubAPY();
      unsubWallet && unsubWallet();
    };
  }, [api.query.assets, api.query.lending, accountPair, rowId]);

  const renderCollateralSlider = () => {
    return (
      <div className="SupplyMarket-collateral-column Market-table-cell">
        <Checkbox slider className="SupplyMarket-table-cell-slider" onChange={() => {}}/>
      </div>
    );
  };

  const rowData = SUPPLY_ASSET_LIST[rowId];
  return (
    <div className="Market-table-row" key={`supply ${rowId}`} onClick={() => onClickSupplyMarketRow(rowId)}>
      <div className="SupplyMarket-asset-column Market-table-cell">
        <img className="Market-asset-icon" src={rowData.image} alt="asset-icon" />
        <p className="Market-table-cell-text">{rowData.name}</p>
      </div>
      <div className="SupplyMarket-apy-column Market-table-cell">
        <p className="Market-table-cell-text">{apy}%</p>
      </div>
      <div className="SupplyMarket-wallet-column Market-table-cell">
        <p className="Market-table-cell-text">{`${walletBalance} ${rowData.abbr}`}</p>
      </div>
    </div>
  );
}
