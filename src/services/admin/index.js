import UsersAPI from './UsersAPI';
import TicketAPI from './TicketsAPI';
import BookingsAPI from './BookingsAPI';
import SettingsAPI from './SettingsAPI';

const usersAPI = new UsersAPI();
const ticketsAPI = new TicketAPI();
const bookingsAPI = new BookingsAPI();
const settingsAPI = new SettingsAPI();

export { usersAPI, ticketsAPI, bookingsAPI, settingsAPI };
