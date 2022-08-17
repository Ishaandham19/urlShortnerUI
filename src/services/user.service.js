import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://localhost:8080/auth/";

const createUrl = (Url, Alias) => {
  let createUrlConfig = {
    headers: authHeader()
  }
  
  let createUrlData = {
      "Url" : Url,
      "Alias" : Alias
  }
  return axios.post(API_URL + "url", createUrlData, createUrlConfig)
};

const getUserUrls = () => {
  let createUrlConfig = {
    headers: authHeader()
  }
  
  return axios.get(API_URL + "url", { headers: authHeader()});
};

const UserService = {
  createUrl,
  getUserUrls
};

export default UserService;
