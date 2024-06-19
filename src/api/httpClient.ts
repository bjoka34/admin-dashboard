import axios from 'axios';

// export const BASE_URL = process.env.REACT_APP_API_URL;

export const httpClient = axios.create({
    // baseURL: "https://qqriq-api.tfcapital.me/api",
    // baseURL: "https://tfcapital-dev.qqriq.me/api",
    baseURL: "http://localhost:5022/api",
    headers: {
        'Content-Type': 'application/json',
    },
});
