import React from 'react';
import { connect } from 'react-redux';

import { ReactComponent as Faucet } from 'resources/icons/Faucet.svg';
import { useSubstrate } from 'services/substrate-lib';
import { numberToU128String } from 'utils/numberUtils';
import './FaucetButton.scss';

const AMOUNT = 100; // in USD

/* global BigInt */
function Main(props) {
  const { api, keyring } = useSubstrate();
  const { accountPair, assets } = props;

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

    Promise.allSettled(
      assets.map((asset, idx) => {
        if (asset.name === 'KONO') {
          return api.tx.balances
            .transfer(accountPair.address, numberToU128String(AMOUNT))
            .signAndSend(aliceAccount, { nonce: nonce.toNumber() + idx });
        } else {
          return api.tx.currencies
            .transfer(
              accountPair.address,
              asset.currencyId,
              numberToU128String(AMOUNT)
            )
            .signAndSend(aliceAccount, { nonce: nonce.toNumber() + idx });
        }
      })
    )
      .then(res => {
        console.log(
          '🚀 ~ file: FaucetButton.js ~ line 44 ~ onClickButton ~ res',
          res
        );
      })
      .catch(err => {
        console.log(
          '🚀 ~ file: FaucetButton.js ~ line 51 ~ onClickButton ~ err',
          err
        );
      });
  };

  return (
    <div className="FaucetButton" onClick={onClickButton}>
      <Faucet />
    </div>
  );
}

const mapStateToProps = state => ({
  assets: state.market.assets,
  decimals: state.market.decimals,
});

export default connect(mapStateToProps)(Main);
