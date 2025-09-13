const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

import axios from "axios";
import { handleRequest } from "../../utils/handler";

export const sendConnectionRequest = async (token, status, userId) =>
  handleRequest(() =>
    axios.post(
      `${API_URL}/request/${status}/${userId}`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  );

  export const respondToConnectionRequest = async (token, status, connectionId) =>
  handleRequest(() =>
    axios.post(
      `${API_URL}/request/user/${status}/${connectionId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
  );
    