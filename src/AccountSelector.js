import React, { useState, useEffect } from 'react';

import { useSubstrate } from './substrate-lib';
import './AccountSelector.css';

function DropdownBaseButton (props) {
  const { setOpen, account } = props;

  const shortAddress = account.address.slice(0,5) + "..." + account.address.slice(-7);

  return (
    <div className="Dropdown-base-container" onClick={() => setOpen(true)}>
      <div className="Dropdown-base-left">
        <p className="Dropdown-left-name name-selected">{account.name}</p>
      </div>
      <div className="Dropdown-base-right">
        <p className="Dropdown-right-address address-selected">{shortAddress}</p>
      </div>
    </div>
  );
}

function DropdownOptions (props) {
  const { accountOptions, selectedAccount, setOpen, setAccountAddress, setSelectedAccount } = props;

  const toggleContainer = React.createRef();

  const onClickOutsideHandler = (event) => {
    if (!toggleContainer.current.contains(event.target)) {
      setOpen(false);
    }
  }

  useEffect(() => {
    window.addEventListener("click", onClickOutsideHandler);
    return () => {
      window.removeEventListener("click", onClickOutsideHandler);
    }
  });

  const onClickRow = (index) => {
    return () => {
      const account = accountOptions[index];
      setAccountAddress(account.address);
      setSelectedAccount(account);
      setOpen(false);
    };
  }

  const renderRow = (index) => {
    const account = accountOptions[index];
    const isFirst = index === 0;
    const isLast = index === accountOptions.length - 1;
    const isSelected = account.address === selectedAccount.address;

    const rowHeight = 30 - (isFirst ? 2 : 0) - (isLast ? 2 : 0);

    const nameStyle = "Dropdown-row-left-name" + (isSelected ? " name-selected" : "");
    const addressStyle = "Dropdown-row-right-address" + (isSelected ? " address-selected" : "");
    const leftStyle = {};
    const rightStyle = {};
    if (isFirst) {
      leftStyle["borderTopLeftRadius"] = "11px";
      rightStyle["borderTopRightRadius"] = "11px";
    }
    if (isLast) {
      leftStyle["borderBottomLeftRadius"] = "11px";
      rightStyle["borderBottomRightRadius"] = "11px";
    }

    const shortAddress = account.address.slice(0,5) + "..." + account.address.slice(-7);

    return (
      <div
        key={account.name}
        className="Dropdown-option-row"
        style={{height: `${rowHeight}px`}}
        onClick={onClickRow(index)}>
        <div className="Dropdown-row-left" style={leftStyle}>
          <p
            className={nameStyle}
            style={{lineHeight: `${rowHeight}px`}}>
            {account.name}
          </p>
        </div>
        <div className="Dropdown-row-right" style={rightStyle}>
          <p
            className={addressStyle}
            style={{lineHeight: `${rowHeight}px`}}>
            {shortAddress}
          </p>
        </div>
      </div>
    )
  }

  const totalHeight = accountOptions.length * 30;

  return (
    <div
      className="Dropdown-options-container"
      style={{height: `${totalHeight}px`}}
      ref={toggleContainer}>
      {accountOptions.map((option, index) => renderRow(index))}
    </div>
  );
}

export default function AccountSelector (props) {
  const { keyring } = useSubstrate();
  const { setAccountAddress } = props;
  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState({name: "", address: ""});

  const injectedKeyringOptions =
    keyring.getPairs().filter(account => account.meta.isInjected)
    // keyring.getPairs()
    .map(account => {
      const shortAddress = account.address.slice(0,6) + "..." + account.address.slice(-4);
      return {
        name: account.meta.name,
        address: account.address
      };
    });

  const initialAddress =
    injectedKeyringOptions.length > 0 ? injectedKeyringOptions[0].address : '';

  // Set the initial address
  useEffect(() => {
    setSelectedAccount(injectedKeyringOptions[0]);
    if (initialAddress !== "") {
      setAccountAddress(initialAddress);
    }
  }, [setAccountAddress, initialAddress]);

  const renderDropdown = () => {
    if (!open || injectedKeyringOptions.length === 1) {
      return <DropdownBaseButton setOpen={setOpen} account={selectedAccount} />
    } else {
      return (
        <DropdownOptions
          setAccountAddress={setAccountAddress}
          setOpen={setOpen}
          setSelectedAccount={setSelectedAccount}
          accountOptions={injectedKeyringOptions}
          selectedAccount={selectedAccount}/>
      );
    }
  }

  return (
    <div className="AccountSelector-container">
      {renderDropdown()}
    </div>
  )
}
