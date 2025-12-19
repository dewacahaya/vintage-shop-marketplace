import axios from "axios";

const DB_URL = "https://vintage-shop-fad7f-default-rtdb.asia-southeast1.firebasedatabase.app";

export default {
    namespaced: true,
    state() {
        return {
            transactions: [],
            transactionDetail: null
        }
    },
    getters: {
        getTransactions: (state) => state.transactions || [],
        getTransactionDetail: (state) => state.transactionDetail
    },
    mutations: {
        setTransaction(state, transactions) {
            state.transactions = transactions;
        },
        setTransactionDetail(state, detail) {
            state.transactionDetail = detail;
        },
        updateItemRating(state, { itemIndex }) {
            if (state.transactionDetail && state.transactionDetail.items[itemIndex]) {
                state.transactionDetail.items[itemIndex].isRated = true;
            }
        }
    },
    actions: {
        async fetchTransactions({ commit, rootState }) {
            const token = rootState.auth.token;
            const userId = rootState.auth.userLogin.userId;

            if (!userId || !token) return;

            try {
                const { data } = await axios.get(`${DB_URL}/users/${userId}/orders.json?auth=${token}`);
                if (data) {
                    const formatted = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }));
                    commit("setTransaction", formatted.reverse());
                } else {
                    commit("setTransaction", []);
                }
            } catch (error) {
                console.error("Error fetching transactions:", error);
                throw error;
            }
        },
        async fetchTransactionDetail({ commit, rootState }, orderId) {
            const token = rootState.auth.token;
            const userId = rootState.auth.userLogin.userId;

            if (!userId || !token) return;

            try {
                const { data } = await axios.get(`${DB_URL}/users/${userId}/orders/${orderId}.json?auth=${token}`);
                if (data) {
                    commit("setTransactionDetail", { id: orderId, ...data });
                } else {
                    commit("setTransactionDetail", null);
                }
            } catch (error) {
                console.error("Error fetching transaction detail:", error);
                throw error;
            }
        },
        async submitRating({ commit, rootState }, payload) {
            const { orderId, itemIndex, rating, review } = payload;
            const userId = rootState.auth.userLogin.userId;
            const token = rootState.auth.token;
            if (!userId || !token) return;
            const ratingData = {
                score: rating,
                comment: review,
                createdAt: new Date().toISOString()
            };
            try {
                await axios.patch(`${DB_URL}/users/${userId}/orders/${orderId}/items/${itemIndex}.json?auth=${token}`, {
                    isRated: true,
                    userRating: ratingData
                });
                commit('updateItemRating', { itemIndex });
            } catch (error) {
                console.error("Error submitting rating:", error);
                throw error;
            }
        }
    }
}