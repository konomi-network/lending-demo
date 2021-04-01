import React from 'react';

import { ReactComponent as Faucet } from 'resources/icons/Faucet.svg';
import { useSubstrate } from 'services/substrate-lib';
import './FaucetButton.scss';

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
      <Faucet />
    </div>
  )
}
