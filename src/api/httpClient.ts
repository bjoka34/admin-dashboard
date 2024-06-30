import axios from 'axios';

// export const BASE_URL = process.env.REACT_APP_API_URL;

export const httpClient = axios.create({
    baseURL: "https://api.meprogram.me:5044/api",
    // baseURL: "http://localhost:5022/api",
    headers: {
        'Content-Type': 'application/json',
    },
});
