<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';
import BaseButton from '../ui/BaseButton.vue';

const store = useStore();
const orders = ref([]);
const isLoading = ref(false);

const DB_URL = "https://vintage-shop-fad7f-default-rtdb.asia-southeast1.firebasedatabase.app";

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

const fetchOrders = async () => {
    isLoading.value = true;
    try {
        const token = store.state.auth.token;
        const userId = store.state.auth.userLogin.userId;

        if (!userId || !token) return;
        const { data } = await axios.get(`${DB_URL}/users/${userId}/orders.json?auth=${token}`);

        if (data) {
            const formattedOrders = Object.keys(data).map(key => ({
                id: key,
                ...data[key]
            }));
            orders.value = formattedOrders.reverse();
        } else {
            orders.value = [];
        }

    } catch (error) {
        console.error("Failed to fetch orders:", error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchOrders();
});
</script>

<template>
    <div>
        <h2 class="text-xl font-bold text-slate-900 mb-6">My Order</h2>
        <div v-if="isLoading" class="flex justify-center py-10">
            <p class="text-slate-500">Loading your transactions...</p>
        </div>
        <div v-else-if="orders.length === 0"
            class="flex flex-col items-center justify-center py-12 bg-white border border-slate-200 rounded-xl shadow-sm text-center">
            <div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-10 h-10 text-slate-400">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
            </div>
            <h3 class="text-lg font-bold text-slate-900 mb-2">No orders yet</h3>
            <p class="text-slate-500 max-w-xs mb-6 text-sm">Looks like you haven't made your choice yet.</p>
            <router-link to="/products">
                <BaseButton
                    class="bg-teal-700 text-white px-6 py-2.5 rounded-lg hover:bg-teal-800 transition shadow-sm font-medium">
                    Start Shopping
                </BaseButton>
            </router-link>
        </div>
        <div v-else class="space-y-6">
            <div v-for="trx in orders" :key="trx.id"
                class="bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:border-teal-100 transition duration-300">
                <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm mb-4 border-b border-gray-100 pb-4">
                    <div class="flex items-center gap-2 font-semibold text-slate-800">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                            class="w-5 h-5 text-teal-700">
                            <path fill-rule="evenodd"
                                d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 004.25 22.5h15.5a1.875 1.875 0 001.865-2.071l-1.263-12a1.875 1.875 0 00-1.865-1.679H16.5V6a4.5 4.5 0 10-9 0zM12 3a3 3 0 00-3 3v.75h6V6a3 3 0 00-3-3zm-3 8.25a3 3 0 106 0v-.75a.75.75 0 011.5 0v.75a4.5 4.5 0 11-9 0v-.75a.75.75 0 011.5 0v.75z"
                                clip-rule="evenodd" />
                        </svg>
                        Shopping
                    </div>
                    <span class="text-slate-500">{{ trx.date }}</span>
                    <span class="px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">
                        {{ trx.status || 'Done' }}
                    </span>

                    <span class="text-slate-400 font-mono text-xs uppercase">{{ trx.id }}</span>
                </div>
                <div v-if="trx.items && trx.items.length > 0" class="flex flex-col sm:flex-row gap-6">
                    <div class="w-20 h-20 shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                        <img :src="trx.items[0].image" :alt="trx.items[0].title" class="w-full h-full object-cover">
                    </div>
                    <div class="flex-1">
                        <h3 class="font-bold text-slate-800 text-base mb-1 line-clamp-2">
                            {{ trx.items[0].title }}
                        </h3>
                        <p class="text-sm text-slate-500 mb-1">
                            {{ trx.items[0].quantity }} product x {{ formatRupiah(trx.items[0].price) }}
                        </p>
                        <p class="text-sm text-slate-500">
                            {{ trx.items[0].quantity }} / {{ trx.items[0].size }}
                        </p>

                        <div v-if="trx.items.length > 1" class="mt-3 text-sm text-slate-400">
                            + {{ trx.items.length - 1 }} more products
                        </div>
                    </div>
                    <div
                        class="flex flex-row sm:flex-col justify-between items-end sm:border-l sm:border-gray-100 sm:pl-6 min-w-35">
                        <div class="text-right mb-0 sm:mb-auto">
                            <p class="text-xs text-slate-500 mb-1">Total price</p>
                            <p class="font-bold text-slate-900 text-lg">{{ formatRupiah(trx.totalPrice) }}</p>
                        </div>
                    </div>
                </div>
                <div class="flex justify-end mt-6 pt-4 border-t border-gray-50">
                    <router-link :to="`/product/${trx.items[0].id}`">
                        <BaseButton
                            class="bg-[#178A8D] text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-700 transition shadow-sm text-sm">
                            Buy Again
                        </BaseButton>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>