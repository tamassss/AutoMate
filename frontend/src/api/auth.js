import api, { setAccessToken, clearAccessToken } from "./axios";

export const login = async (email, password) => {
    try {
        const res = await api.post("/api/login/", {
            email,
            password,
        });
        setAccessToken(res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        return res
    }
    catch (Err) {
        throw Err
    }
};

export const register = async (email, password, nev) => {
    await api.post("/api/register/", {
        email,
        password,
        nev,
    });
};

export const logout = () => {
    clearAccessToken();
    localStorage.removeItem("refresh");
};
