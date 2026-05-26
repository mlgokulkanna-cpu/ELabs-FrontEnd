import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getMasterData = async () => {
  const response = await API.get("/master-data");
  return response.data;
};

export const getAgentData = async () => {
  const response = await API.get("/agent-data");
  return response.data;
};