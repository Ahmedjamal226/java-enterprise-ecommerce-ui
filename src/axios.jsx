import axios from "axios";

const API = axios.create({
  // Make sure it includes the secure https prefix and NO trailing slash
  baseURL: "https://java-enterprise-ecommerce-backend.onrender.com/api" 
});

export default API;
