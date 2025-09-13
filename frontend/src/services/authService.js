import axios from "axios";
import { handleRequest } from "../../utils/handler";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";




export const loginUser = async (email, password) =>
  handleRequest(() => axios.post(`${API_URL}/login`, { email, password }));


export const registerUser = async (firstname, lastname, email, password) =>
  handleRequest(() => axios.post(`${API_URL}/signup`, { firstname, lastname, email, password }));


export const logoutUser = async () =>
  handleRequest(() => axios.post(`${API_URL}/logout`));

