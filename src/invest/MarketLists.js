import React, { useState } from 'react';
import { Modal } from 'semantic-ui-react';

import BorrowMarketRow from './BorrowMarketRow';
import BorrowRepayModal from './BorrowRepayModal';
import SupplyMarketRow from './SupplyMarketRow';
import SupplyWithdrawModal from './SupplyWithdrawModal';
import './BorrowMarketRow.css';
import './MarketLists.css';
import './SupplyMarketRow.css';

import KonomiImage from '../resources/img/KONO.png';
import DotImage from '../resources/img/DOT.png';
import KsmImage from '../resources/img/KSM.png';
import EthImage from '../resources/img/ETH.png';
import BtcImage from '../resources/img/BTC.png';

const ASSET_LIST = [
  { id: 0, name: 'Konomi', abbr: 'KONO', image: KonomiImage },
  { id: 1, name: 'Polkadot', abbr: 'DOT', image: DotImage },
  { id: 2, name: 'Kusama', abbr: 'KSM', image: KsmImage },
  { id: 3, name: 'Ethereum', abbr: 'ETH', image: EthImage },
  { id: 4, name: 'Bitcoin', abbr: 'BTC', image: BtcImage }
];

export default function Main (props) {
  const { accountPair } = props;

  const [supplyModalOpen, setSupplyModalOpen] = useState(false);
  const [borrowModalOpen, setBorrowModalOpen] = useState(false);
  const [borrowId, setBorrowId] = useState(0);
  const [supplyId, setSupplyId] = useState(0);

  const renderSupplyModal = () => {
    return (
      <Modal
        onClose={() => setSupplyModalOpen(false)}
        onOpen={() => setSupplyModalOpen(true)}
        open={supplyModalOpen}
        size='tiny'
      >
        <Modal.Content>
          <SupplyWithdrawModal
            accountPair={accountPair}
            assetId={supplyId}
            setModalOpen={setSupplyModalOpen} />
        </Modal.Content>
      </Modal>
    );
  };

  const onClickSupplyMarketRow = (rowId) => {
    setSupplyId(rowId);
    setSupplyModalOpen(true);
  };

  const renderSupplyMarketRow = (rowId) => {
    return (
      <SupplyMarketRow
        key={`supply ${rowId}`}
        rowId={rowId}
        accountPair={accountPair}
        onClickSupplyMarketRow={onClickSupplyMarketRow} />
    );
  };

  const renderSupplyMarketTableContent = () => {
    const rows = [];
    for (var i = 0; i < ASSET_LIST.length; i++) {
      rows.push(renderSupplyMarketRow(i));
    }
    return (
      <div>
        {rows}
      </div>
    );
  };

  const renderBorrowModal = () => {
    return (
      <Modal
        onClose={() => setBorrowModalOpen(false)}
        onOpen={() => setBorrowModalOpen(true)}
        open={borrowModalOpen}
        size='tiny'
      >
        <Modal.Content>
          <BorrowRepayModal
            accountPair={accountPair}
            assetId={borrowId}
            setModalOpen={setBorrowModalOpen} />
        </Modal.Content>
      </Modal>
    );
  };

  const onClickBorrowMarketRow = (rowId) => {
    setBorrowId(rowId);
    setBorrowModalOpen(true);
  };

  const renderBorrowMarketRow = (rowId) => {
    return (
      <BorrowMarketRow
        key={`borrow ${rowId}`}
        rowId={rowId}
        accountPair={accountPair}
        onClickBorrowMarketRow={onClickBorrowMarketRow} />
    );
  };

  const renderBorrowMarketTableContent = () => {
    const rows = [];
    for (var i = 0; i < ASSET_LIST.length; i++) {
      rows.push(renderBorrowMarketRow(i));
    }
    return (
      <div>
        {rows}
      </div>
    );
  };

  return (
    <div className="MarketLists-container">
      {renderSupplyModal()}
      {renderBorrowModal()}
      <div className="Market-container">
        <p className="Market-title">Supply Markets</p>
        <div className="Market-table-header">
          <p className="SupplyMarket-asset-column Market-table-header-text">Asset</p>
          <p className="SupplyMarket-apy-column Market-table-header-text">APY</p>
          <p className="SupplyMarket-wallet-column Market-table-header-text">Wallet</p>
        </div>
        {renderSupplyMarketTableContent()}
      </div>
      <div className="MarketLists-middle-padding"></div>
      <div className="Market-container">
        <p className="Market-title">Borrow Markets</p>
        <div className="Market-table-header">
          <p className="BorrowMarket-asset-column Market-table-header-text">Asset</p>
          <p className="BorrowMarket-apy-column Market-table-header-text">APY</p>
          <p className="BorrowMarket-wallet-column Market-table-header-text">Wallet</p>
          <p className="BorrowMarket-liquidity-column Market-table-header-text">Liquidity</p>
        </div>
        {renderBorrowMarketTableContent()}
      </div>
    </div>
  );
}