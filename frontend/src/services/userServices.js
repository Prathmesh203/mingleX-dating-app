const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

import axios from "axios";
import { handleRequest } from "../../utils/handler";


export const getUserFeed = async (token,  page = 1, limit = 10) =>
  handleRequest(() =>
    axios.get(`${API_URL}/user/feed`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { page, limit },
    })
  );

  export const getUserRequests = async (token) =>
  handleRequest(() =>
    axios.get(`${API_URL}/user/connections`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );

  export const getUserConnections = async (token) =>
  handleRequest(() =>
    axios.get(`${API_URL}/user/request`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );



export const getMessages = async (token, otherUserId) =>
  handleRequest(() =>
    axios.get(`${API_URL}/messages/${otherUserId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );


