import React, { useState, useEffect } from 'react';

import { Dropdown } from 'semantic-ui-react';

import { useSubstrate } from './substrate-lib';

import './AccountSelector.css';

function DropdownBaseButton (props) {
  const { setOpen, account } = props;

  // const shortAddress = account.value.slice(0,5) + "..." + account.address.slice(-7);

  return (
    <div className="Dropdown-base-container" onClick={() => setOpen(true)}>
      <div className="Dropdown-left">
        <p>Alice</p>
      </div>
      <div className="Dropdown-right">
        <p>abcde...abcdefg</p>
      </div>
    </div>
  );
}

function DropdownOptions (props) {
  const { accountList, selectedAccount, setOpen } = props;

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

  const onClickOptions = () => {
  }

  return (
    <div className="Dropdown-options-container" ref={toggleContainer} onClick={onClickOptions}>
    </div>
  );
}

export default function AccountSelector (props) {
  const { keyring } = useSubstrate();
  const { setAccountAddress } = props;
  const [open, setOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Get the list of accounts we possess the private key for
  const keyringOptions = keyring.getPairs().map(account => ({
    key: account.address,
    value: account.address,
    name: account.meta.name,
    text: account.meta.name.toUpperCase()
  }));

  const initialAccount =
      keyringOptions.length > 0 ? keyringOptions[0] : null;
  const initialAddress =
      keyringOptions.length > 0 ? keyringOptions[0].value : '';

  useEffect(() => {
    setAccountAddress(initialAddress);
    setSelectedAccount(initialAccount);
  }, [setAccountAddress, initialAddress]);

  const renderDropdown = () => {
    if (!open) {
      return <DropdownBaseButton setOpen={setOpen} account={selectedAccount} />
    } else {
      return <DropdownOptions setOpen={setOpen} />
    }
  }

  return (
    <div className="AccountSelector-container">
      {renderDropdown()}
    </div>
  )
}

// function Main (props) {
//   const { keyring } = useSubstrate();
//   const { setAccountAddress } = props;
//   const [isOpen, setOpen] = useState(false);
//   const [accountSelected, setAccountSelected] = useState('');
//
//   const toggleContainer = React.createRef();
//
//   // Get the list of accounts we possess the private key for
//   const keyringOptions = keyring.getPairs().map(account => ({
//     key: account.address,
//     value: account.address,
//     name: account.meta.name,
//     text: account.meta.name.toUpperCase()
//   }));
//
//   const initialAddress =
//     keyringOptions.length > 0 ? keyringOptions[0].value : '';
//
//   const onClickOutsideHandler = (event) => {
//     if (
//       isOpen &&
//       !toggleContainer.current.contains(event.target)
//     ) {
//       setOpen(false);
//     }
//   };
//
//   // Set the initial address
//   useEffect(() => {
//     setAccountAddress(initialAddress);
//     setAccountSelected(initialAddress);
//     window.addEventListener("click", onClickOutsideHandler);
//     return () => {
//       window.removeEventListener("click", onClickOutsideHandler);
//     }
//   }, [setAccountAddress, initialAddress]);
//
//   const onClickHandler = () => {
//     setOpen(true);
//   };
//
//   const onChange = (item) => {
//     return () => {
//       setAccountAddress(item.address);
//       setAccountSelected(item.address);
//       setOpen(false);
//     }
//   };
//
//   return (
//     <div style={{ width: '200px', paddingTop: '10px' }}>
//       <Dropdown
//         basic
//         selection
//         fluid
//         placeholder='Account'
//         options={keyringOptions}
//         onChange={(_, dropdown) => {
//           onChange(dropdown.value);
//         }}
//         value={accountSelected}
//       />
//     </div>
//   );
// }
//
// export default function AccountSelector (props) {
//   const { api, keyring } = useSubstrate();
//   return keyring.getPairs && api.query ? <Main {...props} /> : null;
// }
//
// import React, { Component } from "react";
//
// export default class AccountSelector extends Component {
//   constructor(props) {
//     super(props);
//     this.state = { isOpen: false, value: "" };
//     this.toggleContainer = React.createRef();
//   }
//   componentDidMount() {
//     window.addEventListener("click", this.onClickOutsideHandler);
//   }
//
//   componentWillUnmount() {
//     window.removeEventListener("click", this.onClickOutsideHandler);
//   }
//
//   onClickHandler = () => {
//     this.setState(currentState => ({
//       isOpen: !currentState.isOpen
//     }));
//   };
//
//   onClickOutsideHandler = event => {
//     if (
//       this.state.isOpen &&
//       !this.toggleContainer.current.contains(event.target)
//     ) {
//       this.setState({ isOpen: false });
//     }
//   };
//
//   onChange = item => {
//     this.setState({
//       value: item.value,
//       isOpen: false
//     });
//     this.props.onChange(item);
//   };
//   render() {
//     const { isOpen, value } = this.state;
//     const { label, options, placeholder } = this.props;
//     return (
//       <div className="select-box">
//         {label && <label className="label">{label}:</label>}
//
//         <div className="select" ref={this.toggleContainer}>
//           <input
//             class="self-input"
//             className={cx({
//               "self-input": true,
//               "input-hover": isOpen
//             })}
//             readonly=""
//             value={value}
//             onClick={this.onClickHandler}
//             placeholder={placeholder}
//           />
//           <svg
//             viewBox="64 64 896 896"
//             focusable="false"
//             class="svg"
//             className={cx({
//               up: isOpen,
//               down: !isOpen
//             })}
//             data-icon="down"
//             width="1em"
//             height="1em"
//             fill="currentColor"
//             aria-hidden="true"
//           >
//             <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z"></path>
//           </svg>
//
//           <div
//             className="options"
//             className={cx({
//               options: true,
//               "options-hidden": !isOpen
//             })}
//           >
//             {options &&
//               options.map((item) => {
//                 return (
//                   <div
//                     key={item.key}
//                     className="item"
//                     onClick={this.onChange.bind(this, item)}
//                   >
//                     {item.value}
//                   </div>
//                 );
//               })}
//           </div>
//         </div>
//       </div>
//     );
//   }
// }
