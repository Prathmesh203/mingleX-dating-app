import axios from "axios";
import ForgotPassword from "../pages/ForgotPassword";
import { data } from "react-router-dom";

const URL = import.meta.env.VITE_URL;
export const signup = async (data) => {
  try {
    const response = await axios.post(
      `${URL}/signup`,
      {
        firstname: data.firstname,
        lastname: data.lastname,
        email: data.email,
        password: data.password,
      },
      { withCredentials: true }
    );
    localStorage.setItem("authToken", response.data.token);
    // localStorage.setItem("authUser", JSON.stringify(response.data.user));
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error("unable to sign up");
  }
};

const login = async (data) => {
  try {
    const { email, password } = data;
    const response = await axios.post(
      `${URL}/login`,
      {
        email,
        password,
      },
      { withCredentials: true }
    );
    
    return response.data;
  } catch (error) {
    console.log(error);
    
    throw new Error("Something went wrong, email or password is Incorrect");
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(
      `${URL}/logout`,
      {},
      { withCredentials: true }
    );
    if (!response) {
      throw new Error("cant logout ");
    }
    return response;
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("authUser");
    localStorage.removeItem("authToken");
  }
};

export const checkAuthStatus = async () => {
  try {
   
    const response = await axios.get(`${URL}/verify-auth`);
    return response.data; 
  } catch (error) {
    console.log('Auth verification failed:', error);
    return null;
  }
};

export default login;
