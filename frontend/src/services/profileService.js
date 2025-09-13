const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
import axios from "axios";
import { handleRequest } from "../../utils/handler";


export const getProfile = async (token) =>
  handleRequest(() =>
    axios.get(`${API_URL}/profile/view`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );

export const updateProfile = async (token, profileData) =>
  handleRequest(() =>
    axios.patch(`${API_URL}/profile/edit`, profileData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })
  );


export const updatePassword = async (token, passwordData) => {
  return handleRequest(() =>
    axios.put(`${API_URL}/profile/updatePassword`, passwordData, {
      headers: { Authorization: `Bearer ${token}` },
    })
  );
};
