import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

export const getMasterData = async () => {

  const response =
    await API.get("/master-data");

  return response.data;

};

export const getMasterDataById = async (
  id: string
) => {

  const response =
    await API.get(`/master-data/${id}`);

  return response.data;

};

export const getAgentData = async (
  id: string
) => {

  const response =
    await API.get(`/agent-data/${id}`);

  return response.data;

};