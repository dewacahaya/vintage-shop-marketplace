import axios from "axios";
import Cookies from "js-cookie";

const DB_URL = "https://vintage-shop-fad7f-default-rtdb.asia-southeast1.firebasedatabase.app";

export default {
    namespaced: true,
    state() {
        return {
            cartItems: []
        }
    },
    getters: {
        getCartItems: (state) => state.cartItems,
        getCartCount: (state) => state.cartItems.reduce((acc, item) => acc + item.quantity, 0),
        getCartSubtotal: (state) => {
            return state.cartItems.reduce((acc, item) => {
                return acc + (Number(item.price) * item.quantity);
            }, 0);
        },
        getCartShipping: (state) => {
            return state.cartItems.reduce((acc, item) => {
                return acc + (Number(item.shipping) * item.quantity);
            }, 0);
        },
        getCartGrandTotal: (state, getters) => {
            return getters.getCartSubtotal + getters.getCartShipping;
        },
    },
    mutations: {
        addItems(state, product) {
            const existingItem = state.cartItems.find(item => item.id === product.id);
            if (existingItem) {
                if (existingItem.quantity < product.stock) {
                    existingItem.quantity++;
                } else {
                    throw new Error("Out of stock");
                }
            } else {
                state.cartItems.push({
                    id: product.id,
                    title: product.name,
                    price: product.price,
                    image: product.image,
                    size: product.size,
                    color: product.color,
                    stock: product.stock,
                    shipping: product.shipping,
                    quantity: 1
                });
            }
        },
        removeItems(state, index) {
            state.cartItems.splice(index, 1);
        },
        updateQty(state, { index, change }) {
            const item = state.cartItems[index];
            if (item) {
                item.quantity += change;
                if (item.quantity < 1) item.quantity = 1;
            }
        },
        clearCart(state) {
            state.cartItems = [];
        }
    },
    actions: {
        addToCart({ commit }, product) {
            try {
                commit('addItems', product);
                return true;
            } catch (e) {
                return false;
            }
        },
        removeFromCart({ commit }, index) {
            commit('removeItems', index);
        },
        changeQuantity({ commit, state }, { index, change }) {
            const item = state.cartItems[index];
            if (change > 0) {
                if (item.quantity >= item.stock) {
                    return false;
                }
            }
            commit('updateQty', { index, change });
            return true;
        },
        async confirmCheckout({ commit, state, rootState }, payload) {
            try {
                // 1. Ambil Token & User ID (Cek State dulu, kalau kosong cek Cookies)
                const token = rootState.auth.token || Cookies.get('jwt');
                const userId = rootState.auth.userLogin.userId || Cookies.get('UID');

                if (!token || !userId) {
                    throw new Error("User not authenticated. Please login again.");
                }

                // 2. Siapkan Data Order
                const orderData = {
                    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                    status: 'Done',
                    totalPrice: state.cartItems.reduce((acc, item) => acc + (Number(item.price) * item.quantity) + (Number(item.shipping) * item.quantity), 0),
                    items: state.cartItems,
                    shippingDetails: payload || {} // Data form dikirim lewat payload
                };

                // 3. Debugging (Cek console browser)
                console.log("Sending Order to:", `${DB_URL}/users/${userId}/orders.json`);
                console.log("Data:", orderData);

                // 4. POST ke Firebase
                await axios.post(`${DB_URL}/users/${userId}/orders.json?auth=${token}`, orderData);

                // 5. Sukses -> Bersihkan Cart
                commit('clearCart');
                return true;

            } catch (error) {
                console.error("Checkout Error:", error);
                throw error; // Lempar error agar bisa ditangkap di Component
            }
        },
    }
}