import axios from "axios";
export default axios.create({
  baseURL: "https://blooming-shore-87046.herokuapp.com/api/v1",
  timeout: 10000,
});
