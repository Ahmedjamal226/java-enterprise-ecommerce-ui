import axios from "axios";

const API = axios.create({
  baseURL: "https://your-live-backend-url.com/api", 
});
delete API.defaults.headers.common["Authorization"];
export default API;
