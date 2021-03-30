import React, { useEffect, useState } from 'react';

import { useSubstrate } from 'services/substrate-lib';
import { fixed32ToAPY, balanceToUnitNumber, numberToReadableString } from 'utils/numberUtils';
import KonomiImage from 'resources/img/KONO.png';
import DotImage from 'resources/img/DOT.png';
import KsmImage from 'resources/img/KSM.png';
import EthImage from 'resources/img/ETH.png';
import BtcImage from 'resources/img/BTC.png';

import './BorrowMarketRow.scss';

const BORROW_ASSET_LIST = [
  { id: 0, name: 'Konomi', abbr: 'KONO', image: KonomiImage, apy: 0.0002, price: 100 },
  { id: 1, name: 'Polkadot', abbr: 'DOT', image: DotImage, apy: 0.0204, price: 60 },
  { id: 2, name: 'Kusama', abbr: 'KSM', image: KsmImage, apy: 0.039, price: 5 },
  { id: 3, name: 'Ethereum', abbr: 'ETH', image: EthImage, apy: 0.0004, price: 600 },
  { id: 4, name: 'Bitcoin', abbr: 'BTC', image: BtcImage, apy: 0.0078, price: 20000 }
];

export default function Main (props) {
  const { accountPair, rowId, onClickBorrowMarketRow } = props;

  const { api } = useSubstrate();

  const [apy, setAPY] = useState(0);
  const [walletBalance, setWalletBalance] = useState('0');
  const [liquidity, setLiquidity] = useState(0);

  useEffect(() => {
    let unsubLiquidity = null;
    let unsubWallet = null;
    const assetId = rowId;

    if (assetId != null) {
      const getLiquidity = async () => {
        unsubLiquidity = await api.query.lending.pools(assetId, assetPool => {
          if (assetPool.isSome) {
            const unwrappedPool = assetPool.unwrap();
            const liquidityInt = balanceToUnitNumber(unwrappedPool.supply)
                - balanceToUnitNumber(unwrappedPool.debt);
            setLiquidity(liquidityInt);
          } else {
            setLiquidity(0);
          }
        });
      };
      getLiquidity();

      if (accountPair) {
        const getBorrowWallet = async () => {
          unsubWallet = await api.query.assets.balances([assetId, accountPair.address], balance => {
            const balanceNum = balanceToUnitNumber(balance);
            setWalletBalance(numberToReadableString(balanceNum));
          });
        };
        getBorrowWallet();
      }
    }

    return () => {
      unsubLiquidity && unsubLiquidity();
      unsubWallet && unsubWallet();
    };
  }, [api.query.assets, api.query.lending, accountPair, rowId]);

  useEffect(() => {
    const interval = setInterval( async () => {
      const rate = await api.rpc.lending.debtRate(rowId);
      const newAPY = fixed32ToAPY(rate);
      if (newAPY !== apy) {
        setAPY(newAPY);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [rowId]);

  const rowData = BORROW_ASSET_LIST[rowId];
  return (
    <div className="Market-table-row" key={`borrow ${rowId}`} onClick={() => onClickBorrowMarketRow(rowId)}>
      <div className="BorrowMarket-asset-column Market-table-cell">
        <img className="Market-asset-icon" src={rowData.image} alt="asset-icon" />
        <p className="Market-table-asset-text">{rowData.abbr}</p>
      </div>
      <div className="BorrowMarket-apy-column">
        <p className="Market-table-cell-text">{apy}%</p>
      </div>
      <div className="BorrowMarket-wallet-column">
        <p className="Market-table-cell-text">{`${walletBalance} ${rowData.abbr}`}</p>
      </div>
      <div className="BorrowMarket-liquidity-column">
        <p className="Market-table-cell-text">${numberToReadableString(liquidity * rowData.price, true)}</p>
      </div>
    </div>
  );
}
