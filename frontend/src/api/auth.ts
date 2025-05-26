import api from './axios';

export const fetchCurrentUser = async () => {
    const res = await api.get('/users/me');
    return res.data;
};