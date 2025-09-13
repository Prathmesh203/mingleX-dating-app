import axios from "axios";

const API_URL = "http://localhost:3000"

const handleRequest = async (requestFn) => {
  try {
    const response = await requestFn();
    return { success: true, data: response };
  } catch (error) {
    console.error("AuthService Error:", error);

    return {
      success: false,
      error:
        error.message || 
        "Something went wrong",
    };
  }
};


export const loginUser = async (email, password) =>
  handleRequest(() => axios.post(`${API_URL}/login`, { email, password }));


export const registerUser = async (firstname, lastname, email, password) =>
  handleRequest(() => axios.post(`${API_URL}/signup`, { firstname, lastname, email, password }));


export const logoutUser = async () =>
  handleRequest(() => axios.post(`${API_URL}/logout`));

