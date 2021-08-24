import React from 'react';
import { connect } from 'react-redux';

import WalletAssetRow from './WalletAssetRow';

import './Wallet.scss';
import './WalletAssetRow.scss';

function Wallet(props) {
  const { accountPair, assets } = props;

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
        {assets.map(asset => {
          return (
            <WalletAssetRow
              rowData={asset}
              assetId={asset.id}
              accountPair={accountPair}
              key={asset.id}
            />
          );
        })}
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

const mapStateToProps = state => ({
  pools: state.market.pools,
  assets: state.market.assets,
});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
