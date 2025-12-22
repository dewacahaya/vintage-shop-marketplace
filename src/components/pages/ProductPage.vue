<script setup>
import { onMounted, computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import ProductCard from '../ui/ProductCard.vue';
import BaseButton from '../ui/BaseButton.vue';
import ShopByCategory from '../additionals/ShopByCategory.vue';

const store = useStore();
const allProducts = computed(() => store.getters['product/getProducts']);
const searchQuery = computed(() => store.state.search.searchQuery);

const items = computed(() => {
    if (!searchQuery.value) {
        return allProducts.value;
    }
    const lowerQuery = searchQuery.value.toLowerCase();
    return allProducts.value.filter(item =>
        item.name && item.name.toLowerCase().includes(lowerQuery)
    );
});

const activeCategories = ref([]);

const pageTitle = computed(() => {
    if (!activeCategories.value.length) return 'All Products';
    return activeCategories.value.join(', ');
});

const filteredItems = computed(() => {
    const source = items.value || [];
    if (!activeCategories.value.length) return source;
    const activeLower = activeCategories.value.map(c => c.toLowerCase());
    return source.filter(item =>
        item.category && activeLower.includes(item.category.toLowerCase())
    );
});

const currentPage = ref(1);
const itemsPerPage = 10;

const totalPages = computed(() => {
    return Math.ceil(filteredItems.value.length / itemsPerPage);
});

const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredItems.value.slice(start, end);
});

const changePage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

watch([searchQuery, activeCategories], () => {
    currentPage.value = 1;
});

onMounted(() => {
    store.dispatch('product/fetchProductData');
});

const resetKeyword = () => {
    store.commit('search/SET_SEARCH_QUERY', '');
};
</script>

<template>
    <section class="max-w-7xl mx-auto my-8 px-4">
        <div class="flex flex-row justify-between items-center">
            <h2 class="text-2xl font-semibold mb-4 text-slate-900">{{ pageTitle }}</h2>
            <ShopByCategory @change="activeCategories = $event" />
        </div>
        <hr class="mb-6">

        <div v-if="filteredItems.length === 0"
            class="flex flex-col justify-center items-center text-center mt-10 text-gray-500">
            <img src="@/assets/images/bag-cross.svg" alt="bag" class="w-32 mb-4 opacity-50">
            <h1 class="my-2 text-xl font-bold text-slate-900">Product not found</h1>
            <p class="max-w-md mx-auto">
                We cannot find what you looking for with keyword "<strong>{{ searchQuery }}</strong>".
                Try to use other keywords or reset keyword.
            </p>

            <BaseButton @click="resetKeyword" class="mt-6 bg-teal-700 text-white hover:bg-teal-800 transition px-6">
                Reset Keyword
            </BaseButton>
        </div>

        <div v-else>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
                <ProductCard v-for="(item, i) in paginatedItems" :key="item.id || i" v-bind="item" />
            </div>

            <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-8">
                <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
                    class="px-3 py-1 rounded border border-gray-300 text-slate-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>

                <button v-for="page in totalPages" :key="page" @click="changePage(page)"
                    class="w-8 h-8 rounded border text-sm font-medium transition" :class="currentPage === page
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'bg-white text-slate-600 border-gray-300 hover:bg-gray-50'">
                    {{ page }}
                </button>

                <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
                    class="px-3 py-1 rounded border border-gray-300 text-slate-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
        </div>
    </section>
</template>

<style scoped></style>