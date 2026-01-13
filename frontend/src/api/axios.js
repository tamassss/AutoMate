import axios from "axios";

let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
};

export const clearAccessToken = () => {
    accessToken = null;
};

const api = axios.create({
    baseURL: "http://localhost:8000",
});

api.interceptors.request.use((config) => {
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
});

api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const original = err.config;

        if (err.response?.status === 401 && !original._retry) {
            original._retry = true;

            const refresh = localStorage.getItem("refresh");
            if (!refresh) return Promise.reject(err);

            const res = await axios.post(
                "http://localhost:8000/api/token/refresh/",
                { refresh }
            );

            setAccessToken(res.data.access);
            original.headers.Authorization = `Bearer ${res.data.access}`;

            return api(original);
        }

        return Promise.reject(err);
    }
);

export default api;
