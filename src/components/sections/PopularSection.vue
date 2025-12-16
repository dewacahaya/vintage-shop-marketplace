<script setup>
import ProductCard from '../ui/ProductCard.vue';

defineProps({
    items: {
        type: Array,
        required: true
    }
});
</script>

<template>
    <section id="popular" class="max-w-7xl mx-auto my-8">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-2xl font-semibold">Popular Items</h2>
            <router-link to="products" class="text-teal-700">See All</router-link>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <ProductCard v-for="item in items" :key="item.id" v-bind="item" />
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
    </section>
</template> -->