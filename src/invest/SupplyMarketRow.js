import React, { useEffect, useState } from 'react';
import { Checkbox } from 'semantic-ui-react';

import { useSubstrate } from '../substrate-lib';
import { fixed32ToAPY, balanceToUnitNumber, numberToReadableString } from '../numberUtils';
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

export default function Main (props) {
  const { accountPair, rowId, onClickSupplyMarketRow } = props;

  const { api } = useSubstrate();

  const [apy, setAPY] = useState(0);
  const [walletBalance, setWalletBalance] = useState(0);

  useEffect(() => {
    let unsubWallet = null;
    const assetId = rowId;

    if (assetId != null && accountPair) {
      const getSupplyWallet = async () => {
        unsubWallet = await api.query.assets.balances([assetId, accountPair.address], balance => {
          const balanceNum = balanceToUnitNumber(balance);
          setWalletBalance(numberToReadableString(balanceNum));
        });
      };
      getSupplyWallet();
    }

    return () => {
      unsubWallet && unsubWallet();
    };
  }, [api.query.assets, api.rpc.lending, accountPair, rowId]);

  useEffect(() => {
    const interval = setInterval( async () => {
      const rate = await api.rpc.lending.supplyRate(rowId);
      const newAPY = fixed32ToAPY(rate);
      if (newAPY !== apy) {
        setAPY(newAPY);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [rowId]);

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
        <p className="Market-table-asset-text">{rowData.abbr}</p>
      </div>
      <div className="SupplyMarket-apy-column">
        <p className="Market-table-cell-text">{apy}%</p>
      </div>
      <div className="SupplyMarket-wallet-column">
        <p className="Market-table-cell-text">{`${walletBalance} ${rowData.abbr}`}</p>
      </div>
    </div>
  );
}
