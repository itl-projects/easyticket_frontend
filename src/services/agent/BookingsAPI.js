import axiosInstance from '../../config/axiosConfig';

export default class BookingsAPI {
  PATH = 'bookings';

  async getBookings(data) {
    try {
      const res = await axiosInstance.post(`${this.PATH}/getBookings`, data);
      return res;
    } catch (err) {
      return null;
    }
  }

  async bookFlight(data) {
    try {
      const res = await axiosInstance.post(`${this.PATH}/confirm`, data);
      return res;
    } catch (err) {
      return err;
    }
  }
}
