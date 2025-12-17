<script setup>
import { onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import ProductCard from '../ui/ProductCard.vue';
import BaseButton from '../ui/BaseButton.vue';

const store = useStore();
const router = useRouter();

const cartItems = computed(() => store.getters['cart/getCartItems']);
const totalItems = computed(() => store.getters['cart/getCartCount']);

const cartSubtotal = computed(() => store.getters['cart/getCartSubtotal']);
const cartShipping = computed(() => store.getters['cart/getCartShipping']);
const cartGrandTotal = computed(() => store.getters['cart/getCartGrandTotal']);

const recommendations = computed(() => {
    const allProducts = store.getters['product/getProducts'] || [];
    return allProducts.slice(0, 4);
});

onMounted(() => {
    if (recommendations.value.length === 0) {
        store.dispatch('product/fetchProductData');
    }
});

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};
const decreaseQty = async (index) => {
    await store.dispatch('cart/changeQuantity', { index, change: -1 });
};

const increaseQty = async (index, itemTitle) => {
    const success = await store.dispatch('cart/changeQuantity', { index, change: 1 });
    if (!success) {
        alert(`Sorry, stock for "${itemTitle}" is limited.`);
    }
};
const removeItem = (index) => {
    if (confirm("Are you sure you want to remove this item?")) {
        store.dispatch('cart/removeFromCart', index);
    }
};

const goToCheckout = () => {
    router.push({ name: 'checkout' });
}
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
                    <div v-if="cartItems.length > 0" class="space-y-6">
                        <div v-for="(item, index) in cartItems" :key="item.id"
                            class="flex flex-col sm:flex-row gap-4 border-b border-gray-100 pb-6 last:border-0">

                            <div class="w-full sm:w-24 h-24 shrink-0 bg-gray-100 rounded-md overflow-hidden relative">
                                <img :src="item.image" class="w-full h-full object-cover" :alt="item.title">
                                <div v-if="item.quantity >= item.stock"
                                    class="absolute bottom-0 w-full bg-red-500 text-white text-[10px] text-center py-0.5">
                                    Max Stock
                                </div>
                            </div>
                            <div class="flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 class="font-semibold text-slate-900">{{ item.title }}</h3>
                                    <p class="text-sm text-slate-500 mb-1">{{ item.size }} / {{ item.color }}</p>
                                    <p class="text-xs text-gray-400">Stock Available: {{ item.stock }}</p>
                                    <p class="font-medium text-slate-900 mt-1">{{ formatRupiah(item.price) }}</p>
                                </div>
                                <button @click="removeItem(index)"
                                    class="text-red-500 text-xs font-medium hover:text-red-700 w-max mt-2 sm:mt-0 transition">
                                    Remove
                                </button>
                            </div>
                            <div class="flex items-center self-start sm:self-center mt-2 sm:mt-0">
                                <button @click="decreaseQty(index)"
                                    class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l hover:bg-gray-50 text-gray-600 transition disabled:opacity-50"
                                    :disabled="item.quantity <= 1">
                                    -
                                </button>
                                <input type="text" readonly :value="item.quantity"
                                    class="w-10 h-8 border-t border-b border-gray-300 text-center text-sm focus:outline-none text-slate-700 bg-white">
                                <button @click="increaseQty(index, item.title)"
                                    class="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r hover:bg-gray-50 text-gray-600 transition disabled:opacity-50 disabled:bg-gray-100"
                                    :disabled="item.quantity >= item.stock">
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                    <div v-else class="flex flex-col justify-center items-center text-center py-12 text-slate-500">
                        <img src="@/assets/images/cart2.png" alt="cart" class="w-32 mb-6 opacity-60">
                        <p class="text-xl font-bold mb-2">Your cart is empty.</p>
                        <p class="text-sm">Find your favorite items and add to cart before check out.</p>
                        <router-link to="/products" class="mt-4 inline-block">
                            <BaseButton class="bg-teal-700 text-white px-6 py-2 rounded-lg">Find Products</BaseButton>
                        </router-link>
                    </div>
                </div>
                <div class="lg:w-1/3" v-if="cartItems.length > 0">
                    <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-24">
                        <h2 class="font-semibold text-slate-900 mb-4">Order Summary</h2>
                        <div class="flex justify-between mb-2 text-sm">
                            <span class="text-slate-500">Subtotal</span>
                            <span class="font-medium text-slate-900">{{ formatRupiah(cartSubtotal) }}</span>
                        </div>
                        <div class="flex justify-between mb-2 text-sm">
                            <span class="text-slate-500">Shipping</span>
                            <span class="font-medium text-slate-900">{{ formatRupiah(cartShipping) }}</span>
                        </div>
                        <div class="border-t my-4"></div>
                        <div class="flex justify-between font-bold text-slate-900 mb-6 text-lg">
                            <span>Total</span>
                            <span class="text-teal-700">{{ formatRupiah(cartGrandTotal) }}</span>
                        </div>
                        <BaseButton @click="goToCheckout"
                            class="w-full bg-teal-700 text-white py-3 rounded-lg font-medium hover:bg-teal-800 transition shadow-lg">
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