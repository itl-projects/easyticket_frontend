import axiosInstance from '../../config/axiosConfig';

export default class TicketAPI {
  PATH = 'tickets';

  async listTickets(page, rowsPerPage) {
    try {
      const res = await axiosInstance.get(`${this.PATH}?page=${page}&limit=${rowsPerPage}`);
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

  async removeTicket(id) {
    try {
      const res = await axiosInstance.delete(`${this.PATH}/${id}`);
      return res;
    } catch (err) {
      return err;
    }
  }
}
