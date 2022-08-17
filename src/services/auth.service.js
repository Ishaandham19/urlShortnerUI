import axios from "axios";

const API_URL = "http://localhost:8080/";

const register = (UserName, Email, Password) => {
  return axios.post(API_URL + "register", {
    UserName,
    Email,
    Password,
  });
};

const login = (UserName, Password) => {
  return axios
    .post(API_URL + "login", {
      UserName,
      Password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
