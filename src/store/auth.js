import axios from "axios";
import Cookies from "js-cookie";

const API_KEY = "AIzaSyDmZa72BWtyZ - U6fvmK58RxbHq5_D5cDRM";
const DB_URL = `https://vintage-shop-fad7f-default-rtdb.asia-southeast1.firebasedatabase.app/`;

export default {
    namespaced: true,
    state() {
        return {
            token: null,
            tokenExpirationDate: null,
            userLogin: {},
            isLogin: false,
        }
    },
    mutations: {
        setToken(state, { idToken, expiresIn }) {
            state.token = idToken;
            state.tokenExpirationDate = expiresIn;
            Cookies.set("tokenExpirationDate", expiresIn);
            Cookies.set("jwt", idToken);
        },
        setUserLogin(state, { userData, loginStatus }) {
            state.userLogin = userData;
            state.isLogin = loginStatus;
        },
        setUserLogout(state) {
            state.token = null;
            state.tokenExpirationDate = null;
            state.userLogin = {};
            state.isLogin = false;
            Cookies.remove("jwt");
            Cookies.remove("tokenExpirationDate");
            Cookies.remove("UID");
        }
    },
    actions: {
        async getRegisterData({ commit, dispatch }, payload) {
            const authURL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;

            try {
                const { data } = await axios.post(authURL, {
                    email: payload.email,
                    password: payload.password,
                    returnSecureToken: true
                });

                commit("setToken", {
                    idToken: data.idToken,
                    expiresIn: new Date().getTime() + Number.parseInt(data.expiresIn) * 1000
                });

                const newUserData = {
                    userId: data.localId,
                    fullname: payload.fullname,
                    username: payload.username,
                    email: payload.email,
                    imageLink: payload.imageLink || `https://ui-avatars.com/api/?name=${payload.fullname}`,
                };
                Cookies.set("UID", newUserData.userId);
                await dispatch("addNewUser", newUserData);
            } catch (error) {
                console.log(error);
                throw error;
            }
        },

        async addNewUser({ commit, state }, payload) {
            try {
                const { data } = await axios.put(
                    `${DB_URL}/users/${payload.userId}.json?auth=${state.token}`,
                    payload
                );

                commit("setUserLogin", { userData: payload, loginStatus: true });
            } catch (err) {
                console.log(err);
                throw err;
            }
        },

        async getLoginData({ commit, dispatch }, payload) {
            const authURL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;

            try {
                const { data } = await axios.post(authURL, {
                    email: payload.email,
                    password: payload.password,
                    returnSecureToken: true
                });

                commit("setToken", {
                    idToken: data.idToken,
                    expiresIn: new Date().getTime() + Number.parseInt(data.expiresIn) * 1000
                });

                // Ambil data user berdasarkan ID
                await dispatch("getUser", data.localId);

            } catch (error) {
                console.log(error);
                throw error;
            }
        },

        async getUser({ commit, state }, payload) {
            try {
                const { data } = await axios.get(`${DB_URL}/users/${payload}.json?auth=${state.token}`);

                if (data) {
                    Cookies.set("UID", payload);
                    commit("setUserLogin", { userData: data, loginStatus: true });
                }
            } catch (error) {
                console.log(error);
            }
        },

        autoLogin({ commit, dispatch }) {
            const token = Cookies.get("jwt");
            const uid = Cookies.get("UID");
            const expirationDate = Cookies.get("tokenExpirationDate");

            if (token && uid && expirationDate) {
                if (new Date().getTime() < +expirationDate) {
                    commit("setToken", {
                        idToken: token,
                        expiresIn: +expirationDate
                    });
                    dispatch("getUser", uid);
                } else {
                    dispatch("setUserLogout");
                }
            }
        }
    }
}