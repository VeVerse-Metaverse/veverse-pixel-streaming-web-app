import axios from "axios";

const VUE_APP_API_V2 = import.meta.env.VITE_APP_API_V2;

export default {
  async requestStreamingSession(appId: string, worldId?: string) {
      const res = await axios.post(`${VUE_APP_API_V2}/pixelstreaming/session/request`, {appId, worldId});
      const {data, status} = res;

      if (status === 200) {
        return data;
      } else {
        throw new Error(data.message);
      }
  },

  async requestStreamSessionData(sessionId: string) {
    const res = await axios.get(`${VUE_APP_API_V2}/pixelstreaming/session/${sessionId}`);

    const {data, status} = res;

    if (status === 200) {
      return data;
    } else {
      throw new Error(data.message);
    }
  }
}
