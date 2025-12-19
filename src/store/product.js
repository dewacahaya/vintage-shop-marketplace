import axios from "axios";

const API_KEY = "AIzaSyDmZa72BWtyZ - U6fvmK58RxbHq5_D5cDRM";
const DB_URL = `https://vintage-shop-fad7f-default-rtdb.asia-southeast1.firebasedatabase.app/`;

export default {
    namespaced: true,
    state() {
        return {
            products: [],
            productDetail: {},
            productReviews: [],
            averageRating: 0,
            totalReviews: 0
        }
    },
    getters: {
        getProducts: (state) => state.products,
        getProductDetail: (state) => state.productDetail,
        getProductReviews: (state) => state.productReviews,
        getAverageRating: (state) => state.averageRating,
        getTotalReviews: (state) => state.totalReviews,
    },
    mutations: {
        setProductData(state, payload) {
            state.products = payload;
        },
        setProductDetail(state, payload) {
            state.productDetail = payload;
        },
        setReviews(state, { reviews, avg, total }) {
            state.productReviews = reviews;
            state.averageRating = avg;
            state.totalReviews = total;
        }
    },
    actions: {
        async fetchProductData({ commit }) {
            try {
                const { data } = await axios.get(`${DB_URL}/products.json`);
                const arr = []
                for (let key in data) {
                    arr.push({
                        id: key,
                        ...data[key]
                    })
                }
                commit("setProductData", arr)
            } catch (error) {
                console.log(error)
            }
        },
        async fetchProductDetail({ commit }, payload) {
            try {
                const { data } = await axios.get(`${DB_URL}/products/${payload}.json`);
                commit("setProductDetail", { id: payload, ...data })
            } catch (error) {
                console.log(error)
            }
        },
        async fetchProductReviews({ commit, rootState }, productId) {
            try {
                const token = rootState.auth.token;
                const { data: users } = await axios.get(`${DB_URL}/users.json?auth=${token}`);
                if (!users) {
                    commit("setReviews", { reviews: [], avg: 0, total: 0 });
                    return;
                }
                let allReviews = [];
                let totalScore = 0;
                Object.values(users).forEach(user => {
                    if (user.orders) {
                        Object.values(user.orders).forEach(order => {
                            if (order.items) {
                                order.items.forEach(item => {
                                    if (item.id === productId && item.isRated && item.userRating) {
                                        allReviews.push({
                                            username: user.username || "Anonymous",
                                            avatar: user.imageLink || `https://ui-avatars.com/api/?name=${user.username}`,
                                            score: item.userRating.score,
                                            comment: item.userRating.comment,
                                            date: item.userRating.createdAt
                                        });
                                        totalScore += item.userRating.score;
                                    }
                                });
                            }
                        });
                    }
                });
                const count = allReviews.length;
                const avg = count > 0 ? (totalScore / count).toFixed(1) : 0; // 1 desimal (e.g. 4.5)
                commit("setReviews", {
                    reviews: allReviews,
                    avg: avg,
                    total: count
                });
            } catch (error) {
                console.error("Error fetching reviews:", error);
            }
        }
    }
}