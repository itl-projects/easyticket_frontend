import UsersAPI from './UsersAPI';
import TicketAPI from './TicketsAPI';
import BookingsAPI from './BookingsAPI';

const usersAPI = new UsersAPI();
const ticketsAPI = new TicketAPI();
const bookingsAPI = new BookingsAPI();

export { usersAPI, ticketsAPI, bookingsAPI };
