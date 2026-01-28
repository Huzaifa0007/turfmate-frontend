import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
});

// Attach token automatically if logged in
API.interceptors.request.use((req) => {
  const user = localStorage.getItem("userInfo");
  if (user) {
    const { token } = JSON.parse(user);
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;
