<script setup>
import { onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import ProductCard from '../ui/ProductCard.vue';
import BaseButton from '../ui/BaseButton.vue';

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

onMounted(() => {
    store.dispatch('product/fetchProductData');
});

const resetKeyword = () => {
    store.commit('search/SET_SEARCH_QUERY', '');
};
</script>

<template>
    <section class="max-w-7xl mx-auto my-8 px-4">
        <h2 class="text-2xl font-semibold mb-4 text-slate-900">All Products</h2>
        <hr class="mb-6">

        <div v-if="items.length === 0"
            class="flex flex-col justify-center items-center text-center mt-10 text-gray-500">
            <img src="@/assets/images/bag.png" alt="bag" class="w-32 mb-4 opacity-50">
            <h1 class="my-2 text-xl font-bold text-slate-900">Product not found</h1>
            <p class="max-w-md mx-auto">
                We cannot find what you looking for with keyword "<strong>{{ searchQuery }}</strong>".
                Try to use other keywords or reset keyword.
            </p>

            <BaseButton @click="resetKeyword" class="mt-6 bg-teal-700 text-white hover:bg-teal-800 transition px-6">
                Reset Keyword
            </BaseButton>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <ProductCard v-for="(item, i) in items" :key="item.id || i" v-bind="item" />
        </div>
    </section>
</template>

<style scoped></style>