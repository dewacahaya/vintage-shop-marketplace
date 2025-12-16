import { createStore } from "vuex";
import search from "./search";
import auth from "./auth";
import product from "./product";

export const store = createStore({
    modules: {
        search,
        auth,
        product
    }
})