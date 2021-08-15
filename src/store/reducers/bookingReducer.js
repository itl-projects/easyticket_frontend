import {
  SET_FLIGHT_DATA,
  REMOVE_FLIGHT_DATA,
  SET_BOOKING_DATA,
  REMOVE_BOOKING_DATA
} from '../actions/bookingAction';

const initialState = {
  flight: null,
  booking: null
};

export default function BookingReducer(state = initialState, action) {
  switch (action.type) {
    case SET_FLIGHT_DATA:
      return {
        ...state,
        flight: action.data
      };
    case REMOVE_FLIGHT_DATA:
      return {
        ...state,
        flight: null
      };
    case SET_BOOKING_DATA:
      return {
        ...state,
        booking: action.data
      };
    case REMOVE_BOOKING_DATA:
      return {
        ...state,
        booking: null
      };
    default:
      return state;
  }
}
