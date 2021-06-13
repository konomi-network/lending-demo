const initState = {
  supplies: {
    DOT: 0,
    ETH: 0,
  },
  debts: {
    DOT: 0,
    ETH: 0,
  },
  prices: {
    DOT: 1,
    ETH: 100,
  },
  liquidationThreshold: 1.0,
};

export default (state = initState, action) => {
  switch (action.type) {
    // payload: {DOT: 200}
    case 'UPDATE_SUPPLY':
      return {
        ...state,
        supplies: {
          ...state.supplies,
          ...action.payload,
        },
      };
    // payload: {DOT: 200}
    case 'UPDATE_DEBT':
      return {
        ...state,
        debts: {
          ...state.debts,
          ...action.payload,
        },
      };
    // payload: {DOT: 200}
    case 'UPDATE_PRICE':
      return {
        ...state,
        prices: {
          ...state.prices,
          ...action.payload,
        },
      };
    // payload: 1.0
    case 'UPDATE_LIQUIDATION_THRESHOLD':
      return {
        ...state,
        liquidationThreshold: action.payload,
      };
    default:
      return state;
  }
};
