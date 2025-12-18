import { createStore } from "vuex";
import search from "./search";
import auth from "./auth";
import product from "./product";
import cart from "./cart";
import wishlist from "./wishlist";

export const store = createStore({
    modules: {
        search,
        auth,
        product,
        cart,
        wishlist
    }
})