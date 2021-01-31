import axios from "axios";
export default axios.create({
  baseURL: "https://al-tafseer-api.herokuapp.com/api/v1",
  timeout: 10000,
});
