<script setup>
import { ref, computed } from 'vue';
import ProductCard from '../ui/ProductCard.vue';
import BaseButton from '../ui/BaseButton.vue';

// --- 1. DATA DUMMY CART (Nanti diganti dengan data dari Vuex Store) ---
const cartItems = ref([
    // {
    //     id: 1,
    //     title: 'White crewneck',
    //     size: '8 / M',
    //     price: 200000,
    //     quantity: 1,
    //     image: 'https://placehold.co/150x150/e2e8f0/1e293b?text=White+Crewneck'
    // },
    // {
    //     id: 2,
    //     title: 'Red crewneck',
    //     size: '8 / M',
    //     price: 200000,
    //     quantity: 1,
    //     image: 'https://placehold.co/150x150/800000/ffffff?text=Red+Crewneck'
    // },
    // {
    //     id: 3,
    //     title: 'Red crewneck',
    //     size: '8 / M',
    //     price: 200000,
    //     quantity: 1,
    //     image: 'https://placehold.co/150x150/800000/ffffff?text=Red+Crewneck'
    // },
    // {
    //     id: 4,
    //     title: 'Red crewneck',
    //     size: '8 / M',
    //     price: 200000,
    //     quantity: 1,
    //     image: 'https://placehold.co/150x150/800000/ffffff?text=Red+Crewneck'
    // },
]);

// --- 2. DATA DUMMY REKOMENDASI ---
const recommendations = ref([
    { id: 1, title: 'Vintage chicago cubs', price: 200000, desc: '8 / M', img: 'https://placehold.co/300x300/e2e8f0/1e293b?text=Rec+1' },
    { id: 2, title: 'Red Crewneck', price: 200000, desc: '8 / M', img: 'https://placehold.co/300x300/e2e8f0/1e293b?text=Rec+2' },
    { id: 3, title: 'Necklace', price: 200000, desc: '8 / M', img: 'https://placehold.co/300x300/e2e8f0/1e293b?text=Rec+3' },
    { id: 4, title: 'Necklace', price: 200000, desc: '8 / M', img: 'https://placehold.co/300x300/e2e8f0/1e293b?text=Rec+4' },
]);

// --- 3. LOGIC & COMPUTED ---

// Hitung Total Harga
const subtotal = computed(() => {
    return cartItems.value.reduce((acc, item) => acc + (item.price * item.quantity), 0);
});

// Hitung Total Item
const totalItems = computed(() => {
    return cartItems.value.reduce((acc, item) => acc + item.quantity, 0);
});

// Format Rupiah
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

// Fungsi Kurang Qty
const decreaseQty = (index) => {
    if (cartItems.value[index].quantity > 1) {
        cartItems.value[index].quantity--;
    }
};

// Fungsi Tambah Qty
const increaseQty = (index) => {
    cartItems.value[index].quantity++;
};

// Fungsi Hapus Item
const removeItem = (index) => {
    cartItems.value.splice(index, 1);
};
</script>

<template>
    <div class="min-h-screen flex flex-col bg-white">
        <main class="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="flex justify-between items-center mb-6">
                <h1 class="text-2xl font-bold text-slate-900">Cart</h1>
                <span class="text-slate-500 text-sm">{{ totalItems }} Items</span>
            </div>
            <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
                <div class="lg:w-2/3">
                    <div class="bg-gray-50 p-3 rounded mb-6 flex items-center text-sm text-slate-600">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-4 h-4 mr-2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        <span>Shipping to <strong>Kuta, Badung</strong></span>
                    </div>
                    <div class="space-y-6">
                        <div v-for="(item, index) in cartItems" :key="item.id"
                            class="flex flex-col sm:flex-row gap-4 border-b border-gray-100 pb-6 last:border-0">
                            <div class="w-full sm:w-24 h-24 shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                <img :src="item.image" class="w-full h-full object-cover" :alt="item.title">
                            </div>
                            <div class="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 class="font-semibold text-slate-900">{{ item.title }}</h3>
                                    <p class="text-sm text-slate-500">{{ item.size }}</p>
                                    <p class="font-medium text-slate-900 mt-1">{{ formatRupiah(item.price) }}</p>
                                </div>
                                <button @click="removeItem(index)"
                                    class="text-red-500 text-xs font-medium hover:text-red-700 w-max mt-2 sm:mt-0 transition">
                                    Remove
                                </button>
                            </div>
                            <div class="flex items-center self-start sm:self-center mt-2 sm:mt-0">
                                <button @click="decreaseQty(index)"
                                    class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l hover:bg-gray-50 text-gray-600">-</button>
                                <input type="text" readonly :value="item.quantity"
                                    class="w-10 h-8 border-t border-b border-gray-300 text-center text-sm focus:outline-none text-slate-700">
                                <button @click="increaseQty(index)"
                                    class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r hover:bg-gray-50 text-gray-600">+</button>
                            </div>
                        </div>
                    </div>
                    <div v-if="cartItems.length === 0" class="flex flex-col justify-center items-center text-center py-12 text-slate-500">
                        <img src="@/assets/images/cart2.png" alt="cart" class="w-32 mb-6">
                        <div class="max-w-60">
                            <p class="text-xl font-bold mb-2">Your cart is empty.</p>
                            <p>Find your favorite items and add to cart before check out.</p>
                            <router-link to="/" class="w-full inline-block"><base-button class="w-full mt-4 bg-teal-700 text-white hover:bg-teal-800 transition">Find Products</base-button></router-link>
                        </div>
                    </div>
                </div>
                <div class="lg:w-1/3">
                    <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-24">
                        <div class="flex justify-between items-center mb-1">
                            <h2 class="text-base font-semibold text-slate-900">Order Summary</h2>
                            <span class="text-base font-semibold text-slate-900">{{ formatRupiah(subtotal) }}</span>
                        </div>
                        <div class="flex justify-between text-xs text-slate-500 mb-6">
                            <span>{{ totalItems }} Items</span>
                            <span>Not include shipping fee</span>
                        </div>
                        <BaseButton
                            class="w-full bg-teal-700 text-white hover:bg-teal-800 py-3 rounded-lg font-medium transition shadow-sm">
                            Checkout ({{ totalItems }})
                        </BaseButton>
                    </div>
                </div>
            </div>
            <section class="mt-20 border-t border-gray-200 pt-10">
                <h2 class="text-xl font-bold text-slate-900 mb-6">Other Product</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <ProductCard v-for="item in recommendations" :key="item.id" v-bind="item" />
                </div>
            </section>
        </main>
    </div>
</template>

<style scoped></style>