import React, { useState, useEffect } from 'react';

import { Dropdown } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';

function Main (props) {
  const { keyring } = useSubstrate();
  const { setAccountAddress } = props;
  const [accountSelected, setAccountSelected] = useState('');

  // Get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map(account => ({
    key: account.address,
    value: account.address,
    text: account.meta.name.toUpperCase()
  }));

  const initialAddress =
    keyringOptions.length > 0 ? keyringOptions[0].value : '';

  // Set the initial address
  useEffect(() => {
    setAccountAddress(initialAddress);
    setAccountSelected(initialAddress);
  }, [setAccountAddress, initialAddress]);

  const onChange = address => {
    // Update state with new account address
    setAccountAddress(address);
    setAccountSelected(address);
  };

  return (
    <div style={{ width: '200px', paddingTop: '10px' }}>
      <Dropdown
        basic
        selection
        fluid
        placeholder='Account'
        options={keyringOptions}
        onChange={(_, dropdown) => {
          onChange(dropdown.value);
        }}
        value={accountSelected}
      />
    </div>
  );
}

export default function AccountSelector (props) {
  const { api, keyring } = useSubstrate();
  return keyring.getPairs && api.query ? <Main {...props} /> : null;
}
