export const SET_FLIGHT_DATA = 'SET_FLIGHT_DATA';
export const REMOVE_FLIGHT_DATA = 'REMOVE_FLIGHT_DATA';
export const SET_BOOKING_DATA = 'SET_BOOKING_DATA';
export const REMOVE_BOOKING_DATA = 'REMOVE_BOOKING_DATA';

export const setFlightData = (data) => ({
  type: SET_FLIGHT_DATA,
  data
});

export const removeFlightData = () => ({
  type: REMOVE_FLIGHT_DATA
});

export const setBookingData = (data) => ({
  type: SET_BOOKING_DATA,
  data
});

export const removeBookingData = () => ({
  type: REMOVE_BOOKING_DATA
});
