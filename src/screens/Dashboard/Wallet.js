import React from 'react';

import DotImage from 'resources/img/DOT.png';
import EthImage from 'resources/img/ETH.png';
import WalletAssetRow from './WalletAssetRow';

import './Wallet.scss';
import './WalletAssetRow.scss';

const INIT_ASSET_LIST = [
  {
    id: 0,
    name: 'Polkadot',
    abbr: 'DOT',
    image: DotImage,
    balance: null,
    price: 60,
  },
  {
    id: 1,
    name: 'Ethereum',
    abbr: 'ETH',
    image: EthImage,
    balance: null,
    price: 600,
  },
];

export default function Main(props) {
  const { accountPair } = props;

  const renderTableRows = () => {
    const tableRows = INIT_ASSET_LIST.map(asset => {
      return (
        <WalletAssetRow
          rowData={asset}
          assetId={asset.id}
          accountPair={accountPair}
          key={asset.id}
        />
      );
    });
    return tableRows;
  };

  const renderAssetTable = () => {
    return (
      <div className="Wallet-asset-table">
        <div className="Wallet-asset-table-header">
          <div className="WalletAssetRow-column-asset">
            <p className="Wallet-asset-table-header-text Wallet-asset-header-margin">
              Asset
            </p>
          </div>
          <div className="WalletAssetRow-column-supply-balance">
            <p className="Wallet-asset-table-header-text">Supply Balance</p>
          </div>
          <div className="WalletAssetRow-column-borrow-balance">
            <p className="Wallet-asset-table-header-text">Borrow Balance</p>
          </div>
          <div className="WalletAssetRow-column-wallet-balance">
            <p className="Wallet-asset-table-header-text">Wallet Balance</p>
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
  };

  return (
    <div className="Wallet-container">
      <p className="Wallet-asset-summary">ASSET SUMMARY</p>
      {renderAssetTable()}
    </div>
  );
}
