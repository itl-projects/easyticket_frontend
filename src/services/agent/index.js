import FlightsAPI from './FlightsAPI';
import BookingsAPI from './BookingsAPI';
import CreditRequestAPI from './CreditRequestAPI';
import ProfileAPI from './ProfileAPI';

const flightsAPI = new FlightsAPI();
const bookingsAPI = new BookingsAPI();
const creditRequestAPI = new CreditRequestAPI();
const profileAPI = new ProfileAPI();

export { flightsAPI, bookingsAPI, creditRequestAPI, profileAPI };
