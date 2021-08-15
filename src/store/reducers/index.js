import { combineReducers } from 'redux';
import AuthReducer from './authReducer';
import BookingReducer from './bookingReducer';

export default combineReducers({
  auth: AuthReducer,
  booking: BookingReducer
});
