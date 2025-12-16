import axios from "axios";

const API_KEY = "AIzaSyDmZa72BWtyZ - U6fvmK58RxbHq5_D5cDRM";
const DB_URL = `https://vintage-shop-fad7f-default-rtdb.asia-southeast1.firebasedatabase.app/`;

export default {
    namespaced: true,
    state() {
        return {
            products: [],
            productDetail: {}
        }
    },
    getters: {
        getProducts: (state) => state.products,
        getProductDetail: (state) => state.productDetail
    },
    mutations: {
        setProductData(state, payload) {
            state.products = payload;
        },
        setProductDetail(state, payload) {
            state.productDetail = payload;
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
                commit("setProductDetail", data)
            } catch (error) {
                console.log(error)
            }
        }
    }
}