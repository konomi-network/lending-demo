import React, { useEffect, useState } from 'react';

import { useSubstrate } from '../substrate-lib';

export default function Main (props) {
  const { keyring, invitationActiveState, activateInvitation } = useSubstrate();
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('Please activate your account');

  const addressList =
    keyring.getPairs().filter(account => account.meta.isInjected).map(account => account.address);

  useEffect(() => {
    switch (invitationActiveState) {
      case 'Activated':
        break;
      case 'Verification_failed':
        setMessage('Please enter your invitation code to activate your account');
        break;
      case 'Activation_failed':
        setMessage('Invitation code is invalid, please check and re-enter');
        break;
      case 'Activation_error':
        setMessage('Oops, something wrong happened during activation, please try again');
        break;
      default:
        break;
    }
  }, [invitationActiveState]);

  const onChangeInput = (event) => {
    setCode(event.target.value);
  }

  const onClickSubmitButton = () => {
    if (code) {
      activateInvitation(addressList, code);
    }
  }

  if (invitationActiveState === 'Activated') {
    return null;
  }

  if (addressList && addressList.length > 0) {
    return (
      <div>
        <h1 style={{marginLeft: "25px", marginTop: "40px"}}>{message}</h1>
        <input className="MarketModal-input" value={code} autoFocus={true} onChange={onChangeInput} />
        <button className="FaucetButton" onClick={onClickSubmitButton}>Submit</button>
      </div>
    );
  }
}
