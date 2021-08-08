import axiosInstance from '../../config/axiosConfig';

export default class FlightsAPI {
  PATH = 'flights';

  async searchFlights(data) {
    try {
      const res = await axiosInstance.post(this.PATH, data);
      return res;
    } catch (err) {
      return null;
    }
  }

  async bookFlight(data) {
    try {
      const res = await axiosInstance.post(this.PATH, data);
      return res;
    } catch (err) {
      return err;
    }
  }
}
