import React from 'react';

import { useSubstrate } from 'services/substrate-lib';
import './FaucetButton.css';

const moneyBase = 1000000000000;

export default function Main (props) {
  const { api, keyring } = useSubstrate();
  const { accountPair } = props;

  if (!api || !keyring) {
    return null;
  }

  const aliceAccount = keyring.getPairs().find(account => account.meta.name == 'alice');

  if (!accountPair || accountPair.address === aliceAccount.address) {
    return null;
  }

  const onClickButton = async () => {
    // Get the nonce for the admin key
    const { nonce } = await api.query.system.account(aliceAccount.address);
    const gasHash = await api.tx.balances
      .transfer(accountPair.address, 10 * moneyBase)
      .signAndSend(aliceAccount, { nonce });
    if (gasHash) {
      const transferHash0 = await api.tx.assets
        .transferAsset(0, accountPair.address, 1 * moneyBase)
        .signAndSend(aliceAccount, {nonce : nonce.toNumber() + 1});
      const transferHash1 = await api.tx.assets
        .transferAsset(1, accountPair.address, 2 * moneyBase)
        .signAndSend(aliceAccount, {nonce : nonce.toNumber() + 2});
      const transferHash2 = await api.tx.assets
        .transferAsset(2, accountPair.address, 20 * moneyBase)
        .signAndSend(aliceAccount, {nonce : nonce.toNumber() + 3});
      const transferHash3 = await api.tx.assets
        .transferAsset(3, accountPair.address, 0.2 * moneyBase)
        .signAndSend(aliceAccount, {nonce : nonce.toNumber() + 4});
      const transferHash4 = await api.tx.assets
        .transferAsset(4, accountPair.address, 0.005 * moneyBase)
        .signAndSend(aliceAccount, {nonce : nonce.toNumber() + 5});
    }
  }

  return (
    <div className="FaucetButton" onClick={onClickButton}>
      <svg width="28" height="22" viewBox="0 0 28 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle r="6.12741" transform="matrix(-1 0 0 1 12.1118 13.5454)" fill="white"/>
        <path d="M26.7292 21.4687C27.2815 21.4687 27.7338 21.0202 27.6852 20.47C27.5838 19.32 27.3074 18.1902 26.8642 17.12C26.2931 15.7412 25.456 14.4885 24.4008 13.4332C23.3455 12.378 22.0928 11.5409 20.714 10.9698C19.3353 10.3987 17.8576 10.1048 16.3652 10.1048L16.3652 16.9908C16.9533 16.9908 17.5356 17.1066 18.0789 17.3316C18.6222 17.5567 19.1158 17.8865 19.5316 18.3023C19.9475 18.7182 20.2773 19.2118 20.5023 19.7551C20.5994 19.9894 20.6761 20.2309 20.732 20.477C20.8543 21.0156 21.2909 21.4687 21.8432 21.4687L26.7292 21.4687Z" fill="white"/>
        <rect width="12.1904" height="6.88427" rx="2" transform="matrix(-1 0 0 1 12.5127 10.1035)" fill="white"/>
        <path d="M12.1123 11.1305L12.1123 1.00391" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <path d="M18.0127 3.00781L6.08301 3.00781" stroke="white" stroke-width="2.86304" stroke-linecap="round"/>
      </svg>
    </div>
  )
}
