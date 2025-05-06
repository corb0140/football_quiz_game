import axios from "axios";

/**
 * @description This file contains the axios instance used for making API requests.
 * It is configured with a base URL and credentials.
 */
const instance = axios.create({
  baseURL: "http://localhost:8000", // Base URL for the backend API
  withCredentials: true, // send cookies with requests
});

export default instance;
