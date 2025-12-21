import { createStore } from 'vuex';

export default {
    namespaced: true,
    state() {
        return {
            searchQuery: '',
            items: []
        }
    },
    getters: {
        filteredItems: (state) => {
            if (!state.searchQuery) {
                return state.items;
            }
            const lowerQuery = state.searchQuery.toLowerCase();
            return state.items.filter(item =>
                item.title.toLowerCase().includes(lowerQuery)
            );
        }
    },
    mutations: {
        SET_SEARCH_QUERY(state, query) {
            state.searchQuery = query;
        },
        SET_ITEMS(state, items) {
            state.items = items;
        }
    },
    actions: {
    }
};