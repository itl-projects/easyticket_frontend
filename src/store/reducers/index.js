import { combineReducers } from 'redux';
import AuthReducer from './authReducer';
import BookingReducer from './bookingReducer';
import GlobalReducer from './globalReducer';

export default combineReducers({
  auth: AuthReducer,
  booking: BookingReducer,
  global: GlobalReducer
});
