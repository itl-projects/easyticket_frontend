import axiosInstance from '../../config/axiosConfig';

export default class BookingsAPI {
  PATH = 'bookings';

  async listPendingBookings(page, limit) {
    try {
      const res = await axiosInstance.get(`${this.PATH}/pendings?page=${page}&limit=${limit}`);
      return res;
    } catch (err) {
      return null;
    }
  }

  async getBookingCounts() {
    try {
      const res = await axiosInstance.get(`${this.PATH}/get-booking-counts`);
      return res;
    } catch (err) {
      return null;
    }
  }

  async listBookings(data) {
    try {
      const res = await axiosInstance.post(`${this.PATH}/updated`, data);
      return res;
    } catch (err) {
      return null;
    }
  }

  async addTicket(data) {
    try {
      const res = await axiosInstance.post(this.PATH, data);
      return res;
    } catch (err) {
      return err;
    }
  }

  async updatePNR(id, data) {
    try {
      const res = await axiosInstance.patch(`${this.PATH}/${id}`, data);
      return res;
    } catch (err) {
      return err;
    }
  }
}
