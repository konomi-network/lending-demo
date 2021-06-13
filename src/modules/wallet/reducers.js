const initState = {
  balances: {
    DOT: 0,
    ETH: 0,
  },
};

export default (state = initState, action) => {
  switch (action.type) {
    // payload: {DOT: 200}
    case 'UPDATE_WALLET_BALANCE':
      return {
        ...state,
        balances: {
          ...state.balances,
          ...action.payload,
        },
      };
    default:
      return state;
  }
};
