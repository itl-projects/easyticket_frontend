import axiosInstance from '../../config/axiosConfig';

export default class FlightsAPI {
  PATH = 'bookings';

  async getBookings(page, limit) {
    try {
      const res = await axiosInstance.get(`${this.PATH}?page=${page}&limit=${limit}`);
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
