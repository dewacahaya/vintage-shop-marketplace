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
        }
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
        }
    }
}