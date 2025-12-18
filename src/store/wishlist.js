import axios from "axios";

const DB_URL = "https://vintage-shop-fad7f-default-rtdb.asia-southeast1.firebasedatabase.app";

export default {
    namespaced: true,
    state() {
        return {
            items: []
        }
    },
    getters: {
        getWishlistIds: (state) => state.items || [],
        isInWishlist: (state) => (productId) => {
            return (state.items || []).includes(productId);
        },
        getWishlistCount: (state) => (state.items || []).length
    },
    mutations: {
        setWishlist(state, items) {
            state.items = [...items];
        },
        addToWishlist(state, productId) {
            if (!state.items) state.items = [];
            if (!state.items.includes(productId)) {
                state.items = [...state.items, productId];
            }
        },
        removeFromWishlist(state, productId) {
            if (!state.items) return;
            state.items = state.items.filter(id => id !== productId);
        }
    },
    actions: {
        async fetchWishlist({ commit, rootState }) {
            const userId = rootState.auth.userLogin.userId;
            const token = rootState.auth.token;
            if (!userId || !token) return;
            try {
                const { data } = await axios.get(`${DB_URL}/users/${userId}/wishlist.json?auth=${token}`);
                const wishlistIds = data ? Object.keys(data) : [];
                commit("setWishlist", wishlistIds);
            } catch (error) {
                console.error("Error fetching wishlist:", error);
                commit("setWishlist", []);
            }
        },
        async toggleWishlist({ commit, state, rootState }, productId) {
            const userId = rootState.auth.userLogin.userId;
            const token = rootState.auth.token;
            if (!userId || !token) {
                alert("Please login first");
                return;
            }
            const currentItems = state.items || [];
            const isExist = currentItems.includes(productId);
            const url = `${DB_URL}/users/${userId}/wishlist/${productId}.json?auth=${token}`;
            try {
                if (isExist) {
                    await axios.delete(url);
                    commit("removeFromWishlist", productId);
                } else {
                    await axios.put(url, true);
                    commit("addToWishlist", productId);
                }
            } catch (error) {
                console.error("Error toggling wishlist:", error);
            }
        }
    }
}