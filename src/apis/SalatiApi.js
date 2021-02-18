import axios from "axios";
export default axios.create({
  baseURL: "http://192.168.1.33:8000/api/v1",
  timeout: 10000,
});
