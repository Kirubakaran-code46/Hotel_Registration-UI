import axios from "axios";

const baseApiClient = axios.create({
  baseURL: "http://localhost:8081",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default {
  getEmpDetails() {
    return baseApiClient.get("/getDashboardDetails");
  }
};
