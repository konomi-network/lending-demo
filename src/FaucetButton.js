import React, { useState } from 'react';
import { Dropdown } from 'semantic-ui-react';

import { useSubstrate, KNTxButton } from './substrate-lib';
import {ReactComponent as FaucetIcon} from './resources/img/faucet_blue.svg';
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
      .signAndSend(aliceAccount);
    if (gasHash) {
      const transferHash0 = await api.tx.assets
        .transferAsset(0, accountPair.address, 100 * moneyBase)
        .signAndSend(aliceAccount);
      const transferHash1 = await api.tx.assets
        .transferAsset(1, accountPair.address, 100 * moneyBase)
        .signAndSend(aliceAccount, {nonce : nonce.toNumber() + 1});
      const transferHash2 = await api.tx.assets
        .transferAsset(2, accountPair.address, 100 * moneyBase)
        .signAndSend(aliceAccount, {nonce : nonce.toNumber() + 2});
      const transferHash3 = await api.tx.assets
        .transferAsset(3, accountPair.address, 100 * moneyBase)
        .signAndSend(aliceAccount, {nonce : nonce.toNumber() + 3});
      const transferHash4 = await api.tx.assets
        .transferAsset(4, accountPair.address, 100 * moneyBase)
        .signAndSend(aliceAccount, {nonce : nonce.toNumber() + 4});
    }
  }

  return (
    <button className="FaucetButton" onClick={onClickButton}>
      <FaucetIcon className="FaucetButton-img" />
    </button>
  );
}
