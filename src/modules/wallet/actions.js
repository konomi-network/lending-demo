const UPDATE_WALLET_BALANCE = (abbr, balance) => {
  let payload = {};
  payload[abbr] = balance;
  return {
    type: 'UPDATE_WALLET_BALANCE',
    payload: payload,
  };
};

export default { UPDATE_WALLET_BALANCE };
