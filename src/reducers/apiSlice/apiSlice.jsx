import axios from "axios";
export const apiSlice = axios.create({
  baseURL: "https://inventory-server-63c16fba55e4.herokuapp.com/",
});
