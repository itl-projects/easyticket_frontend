import UsersAPI from './UsersAPI';
import TicketAPI from './TicketsAPI';
import BookingsAPI from './BookingsAPI';
import SettingsAPI from './SettingsAPI';
import CreditRequestAPI from './CreditRequestAPI';

const usersAPI = new UsersAPI();
const ticketsAPI = new TicketAPI();
const bookingsAPI = new BookingsAPI();
const settingsAPI = new SettingsAPI();
const creditRequestAPI = new CreditRequestAPI();

export { usersAPI, ticketsAPI, bookingsAPI, settingsAPI, creditRequestAPI };
