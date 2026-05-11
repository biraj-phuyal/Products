import api from './axios'

export const syncUsers = async (userData) => {
    const {data} =  await api.post("/users/sync", userData);
    return data;
};