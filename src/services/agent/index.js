import FlightsAPI from './FlightsAPI';
import BookingsAPI from './BookingsAPI';
import CreditRequestAPI from './CreditRequestAPI';

const flightsAPI = new FlightsAPI();
const bookingsAPI = new BookingsAPI();
const creditRequestAPI = new CreditRequestAPI();

export { flightsAPI, bookingsAPI, creditRequestAPI };
