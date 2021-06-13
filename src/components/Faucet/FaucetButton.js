import React from 'react';

import { ReactComponent as Faucet } from 'resources/icons/Faucet.svg';
import { useSubstrate } from 'services/substrate-lib';
import './FaucetButton.scss';

export default function Main(props) {
  const { api, keyring } = useSubstrate();
  const { accountPair } = props;

  if (!api || !keyring) {
    return null;
  }

  const aliceAccount = keyring
    .getPairs()
    .find(account => account.meta.name == 'alice');

  if (!accountPair || accountPair.address === aliceAccount.address) {
    return null;
  }

  const onClickButton = async () => {
    // Get the nonce for the admin key
    const { nonce } = await api.query.system.account(aliceAccount.address);
    console.log('nonce');
    console.log(nonce);
    const gasHash = await api.tx.currencies
      .transfer(accountPair.address, { basic: { id: 0 } }, 10)
      .signAndSend(aliceAccount, { nonce: nonce.toNumber() + 1 });
    console.log('after gas');
    if (gasHash) {
      const dotNonce = nonce.toNumber() + 10;
      console.log(dotNonce);
      const transferHash0 = await api.tx.currencies
        .transfer(accountPair.address, { native: { id: 0 } }, 20)
        .signAndSend(aliceAccount, { nonce: dotNonce });
      const ethNonce = nonce.toNumber() + 10;
      console.log(ethNonce);
      const transferHash1 = await api.tx.currencies
        .transfer(accountPair.address, { native: { id: 1 } }, 1)
        .signAndSend(aliceAccount, { nonce: ethNonce });
    }
  };

  return (
    <div className="FaucetButton" onClick={onClickButton}>
      <Faucet />
    </div>
  );
}
