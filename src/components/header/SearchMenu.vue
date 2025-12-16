<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const searchQuery = computed({
    get: () => store.state.search.searchQuery,
    set: (val) => store.commit('search/SET_SEARCH_QUERY', val)
});
</script>

<template>
    <div class="relative w-full">
        <input v-model="searchQuery"
            class="w-full bg-gray-50 text-slate-700 text-sm border border-slate-200 rounded-lg pl-10 pr-20 py-2.5 transition duration-300 ease focus:outline-none focus:border-slate-400 focus:bg-white shadow-sm"
            placeholder="Search for items" />

        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd" />
            </svg>
        </div>
    </div>
</template>