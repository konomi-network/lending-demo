const UPDATE_POOLS = pools => {
  return {
    type: 'UPDATE_POOLS',
    payload: pools,
  };
};

const UPDATE_ASSETS = assets => {
  return {
    type: 'UPDATE_ASSETS',
    payload: assets,
  };
};

const UPDATE_USER_BALANCE = userBalance => {
  return {
    type: 'UPDATE_USER_BALANCE',
    payload: userBalance,
  };
};

const UPDATE_SUPPLY = (abbr, supplyAmount) => {
  let payload = {};
  payload[abbr] = supplyAmount;
  return {
    type: 'UPDATE_SUPPLY',
    payload: payload,
  };
};

const UPDATE_DEBT = (abbr, debtAmount) => {
  let payload = {};
  payload[abbr] = debtAmount;
  return {
    type: 'UPDATE_DEBT',
    payload: payload,
  };
};

const UPDATE_PRICE = (abbr, price) => {
  let payload = {};
  payload[abbr] = price;
  return {
    type: 'UPDATE_PRICE',
    payload: payload,
  };
};

const UPDATE_LIQUIDATION_THRESHOLD = threshold => {
  return {
    type: 'UPDATE_LIQUIDATION_THRESHOLD',
    payload: threshold,
  };
};

export default {
  UPDATE_POOLS,
  UPDATE_ASSETS,
  UPDATE_USER_BALANCE,
  UPDATE_SUPPLY,
  UPDATE_DEBT,
  UPDATE_PRICE,
  UPDATE_LIQUIDATION_THRESHOLD,
};
