import React, { useEffect, useState } from 'react';

import { useSubstrate } from '../substrate-lib';
import './InvitationDialog.css';

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
        setMessage('Please key in your invitation code');
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
      <div className="InvitationDialog-container">
        <p className="InvitationDialog-hint">{message}</p>
        <div className="InvitationDialog-form">
          <input
            className="InvitationDialog-input"
            placeholder='enter code here'
            value={code} 
            autoFocus={true} 
            onChange={onChangeInput} />
          <button className="InvitationDialog-activate" onClick={onClickSubmitButton}>Activate</button>
        </div>
      </div>
    );
  }
}
