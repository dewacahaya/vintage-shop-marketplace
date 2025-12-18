<script setup>
import { onMounted, computed, ref } from 'vue';
import { useStore } from 'vuex';
import ProductCard from '../ui/ProductCard.vue';
import BaseButton from '../ui/BaseButton.vue';

const store = useStore();
const isLoading = ref(false);

// 1. Ambil semua produk
const allProducts = computed(() => store.getters['product/getProducts']);

// 2. Ambil List ID Wishlist User
const wishlistIds = computed(() => store.getters['wishlist/getWishlistIds']);

// 3. Filter Produk: Hanya tampilkan produk yang ID-nya ada di wishlist
const wishlistItems = computed(() => {
    return allProducts.value.filter(product => wishlistIds.value.includes(product.id));
});

onMounted(async () => {
    isLoading.value = true;
    try {
        // Fetch Produk & Wishlist secara paralel
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
        <h2 class="text-2xl font-semibold mb-4 text-slate-900">My Wishlist</h2>
        <hr class="mb-6 border-slate-200">

        <div v-if="isLoading" class="flex justify-center py-20">
            <p class="text-slate-400 animate-pulse">Loading wishlist...</p>
        </div>

        <div v-else-if="wishlistItems.length === 0"
            class="flex flex-col justify-center items-center text-center mt-10 text-gray-500">
            <div class="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-10 h-10 text-red-400">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
            </div>
            <h1 class="my-2 text-xl font-bold text-slate-900">Wishlist is Empty</h1>
            <p class="max-w-md mx-auto mb-6 text-sm">
                You haven't saved any items to your wishlist yet. Start shopping and save your favorite items.
            </p>
            <router-link to="/products">
                <BaseButton
                    class="bg-teal-700 text-white hover:bg-teal-800 transition px-8 py-3 rounded-lg font-medium">
                    Find Products
                </BaseButton>
            </router-link>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <ProductCard v-for="item in wishlistItems" :key="item.id" v-bind="item" />
        </div>
    </section>
</template>