import axios from "axios";

export default axios.create({
  baseURL: "http://azan.archi-tech-group.com/MuslimAgenda.php",
  timeout: 100000,
});
