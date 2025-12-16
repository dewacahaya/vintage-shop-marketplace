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
        async fetchItems({ commit }) {
            const mockData = [
                {
                    img: "https://leksikabookstore.com/uploads/63c11a2538ee9_20230113154525-1.jpg",
                    title: "Rindu - Tere Liye",
                    price: 100000,
                    desc: "Novel best-seller."
                },
                {
                    img: "https://leksikabookstore.com/uploads/63c11a2538ee9_20230113154525-1.jpg",
                    title: "Anjay - Tere Liye",
                    price: 100000,
                    desc: "Novel best-seller."
                },
                {
                    img: "https://leksikabookstore.com/uploads/63c11a2538ee9_20230113154525-1.jpg",
                    title: "Rindu - Tere Liye",
                    price: 100000,
                    desc: "Novel best-seller."
                },
                {
                    img: "https://leksikabookstore.com/uploads/63c11a2538ee9_20230113154525-1.jpg",
                    title: "Rindu - Tere Liye",
                    price: 100000,
                    desc: "Novel best-seller."
                },
            ];
            commit('SET_ITEMS', mockData);
        }
    }
};