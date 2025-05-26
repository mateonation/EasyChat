import axios from 'axios';

const auth = axios.create({
    baseURL: import.meta.env.VITE_AUTH_URL,
    withCredentials: true, // Enable sending cookies with requests
});

export default auth;