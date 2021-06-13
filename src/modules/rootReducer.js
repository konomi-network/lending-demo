import { combineReducers } from 'redux';
import wallet from './wallet';
import market from './market';

export default combineReducers({
  wallet: wallet.reducers,
  market: market.reducers,
});
