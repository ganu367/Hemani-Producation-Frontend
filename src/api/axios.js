import axios from "axios";
const BASE_URL = "http://192.168.0.102:8000/";

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
});