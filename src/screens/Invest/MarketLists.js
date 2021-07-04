import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'semantic-ui-react';

import LiquidationAlert from 'components/Liquidation/LiquidationAlert';
import InvitationDialog from 'components/Invitation/InvitationDialog';
import { useSubstrate } from 'services/substrate-lib';
import BorrowMarketRow from './BorrowMarketRow';
import BorrowRepayModal from './BorrowRepayModal';
import SupplyMarketRow from './SupplyMarketRow';
import SupplyWithdrawModal from './SupplyWithdrawModal';
import './BorrowMarketRow.scss';
import './MarketLists.scss';
import './SupplyMarketRow.scss';

function Main(props) {
  const { accountPair, pools } = props;
  const { invitationActiveState } = useSubstrate();

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
        size="tiny"
        style={{ backgroundColor: '#27358D' }}
      >
        <Modal.Content style={{ backgroundColor: '#27358D', padding: '0px' }}>
          <SupplyWithdrawModal
            accountPair={accountPair}
            assetId={supplyId}
            setModalOpen={setSupplyModalOpen}
          />
        </Modal.Content>
      </Modal>
    );
  };

  const onClickSupplyMarketRow = rowId => {
    setSupplyId(rowId);
    setSupplyModalOpen(true);
  };

  const renderSupplyMarketTableContent = () => {
    return (
      <div>
        {Object.values(pools).map(coin => (
          <SupplyMarketRow
            key={`supply ${coin.name}`}
            rowId={coin.name}
            accountPair={accountPair}
            onClickSupplyMarketRow={onClickSupplyMarketRow}
          />
        ))}
      </div>
    );
  };

  const renderBorrowModal = () => {
    return (
      <Modal
        onClose={() => setBorrowModalOpen(false)}
        onOpen={() => setBorrowModalOpen(true)}
        open={borrowModalOpen}
        size="tiny"
        style={{ backgroundColor: '#27358D' }}
      >
        <Modal.Content style={{ backgroundColor: '#27358D', padding: '0px' }}>
          <BorrowRepayModal
            accountPair={accountPair}
            assetId={borrowId}
            setModalOpen={setBorrowModalOpen}
          />
        </Modal.Content>
      </Modal>
    );
  };

  const onClickBorrowMarketRow = rowId => {
    setBorrowId(rowId);
    setBorrowModalOpen(true);
  };

  const renderBorrowMarketRow = rowId => {
    return (
      <BorrowMarketRow
        key={`borrow ${rowId}`}
        rowId={rowId}
        accountPair={accountPair}
        onClickBorrowMarketRow={onClickBorrowMarketRow}
      />
    );
  };

  const renderBorrowMarketTableContent = () => {
    return (
      <div>
        {Object.values(pools).map(coin => (
          <BorrowMarketRow
            key={`borrow ${coin.name}`}
            rowId={coin.name}
            accountPair={accountPair}
            onClickBorrowMarketRow={onClickBorrowMarketRow}
          />
        ))}
      </div>
    );
  };

  if (!accountPair || !accountPair.address) {
    return null;
  }

  if (invitationActiveState !== 'Activated') {
    return <InvitationDialog />;
  }

  return (
    <div className="MarketLists-container-plus-alert">
      <LiquidationAlert {...props} />
      <div className="MarketLists-container">
        {renderSupplyModal()}
        {renderBorrowModal()}
        <div className="Market-container">
          <p className="Market-title">Supply Markets</p>
          <div className="Market-table-header">
            <p className="SupplyMarket-asset-column Market-table-header-text">
              Asset
            </p>
            <p className="SupplyMarket-apy-column Market-table-header-text">
              APY
            </p>
            <p className="SupplyMarket-wallet-column Market-table-header-text">
              Wallet
            </p>
          </div>
          {renderSupplyMarketTableContent()}
        </div>
        <div className="MarketLists-middle-padding"></div>
        <div className="Market-container">
          <p className="Market-title">Borrow Markets</p>
          <div className="Market-table-header">
            <p className="BorrowMarket-asset-column Market-table-header-text">
              Asset
            </p>
            <p className="BorrowMarket-apy-column Market-table-header-text">
              APY
            </p>
            <p className="BorrowMarket-wallet-column Market-table-header-text">
              Wallet
            </p>
            <p className="BorrowMarket-liquidity-column Market-table-header-text">
              Liquidity
            </p>
          </div>
          {renderBorrowMarketTableContent()}
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  pools: state.market.pools,
});

const mapDispatchToProps = {};
export default connect(mapStateToProps, mapDispatchToProps)(Main);
