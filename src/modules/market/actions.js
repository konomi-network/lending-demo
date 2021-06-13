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
  UPDATE_SUPPLY,
  UPDATE_DEBT,
  UPDATE_PRICE,
  UPDATE_LIQUIDATION_THRESHOLD,
};
