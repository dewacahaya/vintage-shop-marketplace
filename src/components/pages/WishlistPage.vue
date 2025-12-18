<script setup>
import { onMounted, computed, ref } from 'vue';
import { useStore } from 'vuex';
import ProductCard from '../ui/ProductCard.vue';
import BaseButton from '../ui/BaseButton.vue';

const store = useStore();
const isLoading = ref(false);

const allProducts = computed(() => store.getters['product/getProducts']);
const wishlistIds = computed(() => store.getters['wishlist/getWishlistIds']);
const wishlistCount = computed(() => store.getters['wishlist/getWishlistCount']);
const wishlistItems = computed(() => {
    return allProducts.value.filter(product => wishlistIds.value.includes(product.id));
});

onMounted(async () => {
    isLoading.value = true;
    try {
        await Promise.all([
            store.dispatch('product/fetchProductData'),
            store.dispatch('wishlist/fetchWishlist')
        ]);
    } finally {
        isLoading.value = false;
    }
});
</script>

<template>
    <section class="max-w-7xl mx-auto my-8 px-4 min-h-[60vh]">
        <div class="flex flex-row justify-between">
            <h2 class="text-2xl font-semibold mb-4 text-slate-900">My Wishlist</h2>
            <p>{{wishlistCount}} items</p>
        </div>
        <hr class="mb-6 border-slate-200">

        <div v-if="isLoading" class="flex justify-center py-20">
            <p class="text-slate-400 animate-pulse">Loading wishlist...</p>
        </div>

        <div v-else-if="wishlistItems.length === 0"
            class="flex flex-col justify-center items-center text-center mt-10 text-gray-500">
            <img src="@/assets/images/favorite.png" alt="favorite icon" class="w-24">
            <h1 class="my-2 text-xl font-bold text-slate-900">No favorite items yet</h1>
            <p class="max-w-md mx-auto mb-6 text-sm">
                When add item to favorite, the item will appear on the favorite list.
            </p>
            <router-link to="/products">
                <BaseButton
                    class="bg-teal-700 text-white hover:bg-teal-800 transition px-16 py-3 rounded-lg font-medium">
                    Find Products
                </BaseButton>
            </router-link>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <ProductCard v-for="item in wishlistItems" :key="item.id" v-bind="item" />
        </div>
    </section>
</template>