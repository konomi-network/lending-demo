import React, { useState, useEffect } from 'react';

import { useSubstrate } from 'services/substrate-lib';
import './AccountSelector.scss';

function DropdownBaseButton(props) {
  const { setOpen, account } = props;

  return (
    <div className="DropdownNew-base-container" onClick={() => setOpen(true)}>
      <p className="DropdownNew-name name-selected">{account.name}</p>
    </div>
  );
}

function DropdownOptions(props) {
  const {
    accountOptions,
    selectedAccount,
    setOpen,
    setAccountAddress,
    setSelectedAccount,
  } = props;

  const toggleContainer = React.createRef();

  const onClickOutsideHandler = event => {
    if (!toggleContainer.current.contains(event.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener('click', onClickOutsideHandler);
    return () => {
      window.removeEventListener('click', onClickOutsideHandler);
    };
  });

  const onClickRow = index => {
    return () => {
      const account = accountOptions[index];
      setAccountAddress(account.address);
      setSelectedAccount(account);
      setOpen(false);
    };
  };

  const renderRow = index => {
    const account = accountOptions[index];
    const isFirst = index === 0;
    const isLast = index === accountOptions.length - 1;
    const isSelected = account.address === selectedAccount.address;

    const nameStyle = 'DropdownNew-name' + (isSelected ? ' name-selected' : '');
    const rowStyle = {};
    if (isFirst) {
      rowStyle['borderTopLeftRadius'] = '25px';
      rowStyle['borderTopRightRadius'] = '25px';
    }
    if (isLast) {
      rowStyle['borderBottomLeftRadius'] = '25px';
      rowStyle['borderBottomRightRadius'] = '25px';
    }

    return (
      <div
        key={account.name}
        className="DropdownNew-option-row"
        style={rowStyle}
        onClick={onClickRow(index)}
      >
        <p className={nameStyle}>{account.name}</p>
      </div>
    );
  };

  const totalHeight = accountOptions.length * 50;

  return (
    <div
      className="DropdownNew-options-container"
      style={{ height: `${totalHeight}px` }}
      ref={toggleContainer}
    >
      {accountOptions.map((option, index) => renderRow(index))}
    </div>
  );
}

export default function AccountSelector(props) {
  const { keyring } = useSubstrate();
  const { setAccountAddress } = props;
  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState({
    name: '',
    address: '',
  });

  const injectedKeyringOptions = keyring
    .getPairs()
    .filter(account => account.meta.isInjected)
    .map(account => {
      return {
        name: account.meta.name,
        address: account.address,
      };
    });

  const initialAddress =
    injectedKeyringOptions.length > 0 ? injectedKeyringOptions[0].address : '';

  // Set the initial address
  useEffect(() => {
    if (initialAddress !== '') {
      setSelectedAccount(injectedKeyringOptions[0]);
      setAccountAddress(initialAddress);
    }
  }, [setAccountAddress, initialAddress]);

  const renderDropdown = () => {
    if (!open || injectedKeyringOptions.length === 1) {
      return <DropdownBaseButton setOpen={setOpen} account={selectedAccount} />;
    } else {
      return (
        <DropdownOptions
          setAccountAddress={setAccountAddress}
          setOpen={setOpen}
          setSelectedAccount={setSelectedAccount}
          accountOptions={injectedKeyringOptions}
          selectedAccount={selectedAccount}
        />
      );
    }
  };

  return <div className="AccountSelectorNew-container">{renderDropdown()}</div>;
}
