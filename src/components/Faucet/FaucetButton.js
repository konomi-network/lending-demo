import React from 'react';

import { ReactComponent as Faucet } from 'resources/icons/Faucet.svg';
import { useSubstrate } from 'services/substrate-lib';
import { numberToU128String } from 'utils/numberUtils';
import './FaucetButton.scss';

/* global BigInt */

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
    console.log(nonce.toNumber());
    const gasHash = await api.tx.currencies
      .transfer(
        accountPair.address,
        { basic: { id: 0 } },
        numberToU128String(1)
      )
      .signAndSend(aliceAccount, { nonce });
    console.log('after gas');
    if (gasHash) {
      const dotNonce = nonce.toNumber() + 1;
      console.log(dotNonce);
      const transferHash0 = await api.tx.currencies
        .transfer(
          accountPair.address,
          { native: { id: 0 } },
          numberToU128String(20)
        )
        .signAndSend(aliceAccount, { nonce: dotNonce });
      const ethNonce = nonce.toNumber() + 2;
      console.log(ethNonce);
      const transferHash1 = await api.tx.currencies
        .transfer(
          accountPair.address,
          { native: { id: 1 } },
          numberToU128String(0.1)
        )
        .signAndSend(aliceAccount, { nonce: ethNonce });
    }
  };

  return (
    <div className="FaucetButton" onClick={onClickButton}>
      <Faucet />
    </div>
  );
}
