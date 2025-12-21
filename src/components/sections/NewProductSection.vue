<script setup>
import { ref, computed } from 'vue';
import ProductCard from '../ui/ProductCard.vue';

const props = defineProps({
    items: {
        type: Array,
        required: true,
        default: () => []
    }
});

const activeCategories = ref([]);

const filteredItems = computed(() => {
    if (!activeCategories.value.length) return props.items;
    return props.items.filter(item =>
        item.category && activeCategories.value.includes(item.category)
    );
});
</script>

<template>
    <section class="max-w-7xl mx-auto my-12 px-4">
        <div class="flex justify-between items-center my-6">
            <h2 class="text-2xl font-semibold text-slate-900">New Products</h2>
            <router-link to="/products" class="text-teal-700 hover:text-teal-800 font-medium">See All</router-link>
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <ProductCard v-for="(item, i) in filteredItems" :key="item.id || i" v-bind="item" />
            <div
                class="flex justify-center items-center border border-gray-200 rounded-xl hover:bg-gray-50 transition cursor-pointer min-h-62.5">
                <router-link to="/products" class="text-teal-700 font-semibold flex flex-col items-center gap-2">
                    <span>See All Product</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
                    </svg>
                </router-link>
            </div>
        </div>
        <div v-if="filteredItems.length === 0 && activeCategories.length > 0" class="text-center py-10 text-gray-500">
            No products found for selected brands.
        </div>
    </section>
</template>

<style scoped></style>