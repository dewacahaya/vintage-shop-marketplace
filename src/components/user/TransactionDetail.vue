<script setup>
import { onMounted, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import BaseButton from '../ui/BaseButton.vue';
import RatingForm from '../additionals/RatingForm.vue';

const route = useRoute();
const router = useRouter();
const store = useStore();
const isLoading = ref(false);
const isSubmitting = ref(false);

const showRatingModal = ref(false);
const selectedItem = ref(null);
const selectedItemIndex = ref(null);

const order = computed(() => store.getters['transaction/getTransactionDetail']);

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

const openRatingModal = (item, index) => {
    selectedItem.value = item;
    selectedItemIndex.value = index;
    showRatingModal.value = true;
};

const handleRatingSubmit = async (ratingPayload) => {
    isSubmitting.value = true;
    try {
        await store.dispatch('transaction/submitRating', {
            orderId: order.value.id,
            itemIndex: selectedItemIndex.value,
            rating: ratingPayload.rating,
            review: ratingPayload.review
        });
        showRatingModal.value = false;
        selectedItem.value = null;
        selectedItemIndex.value = null;
        alert("Thank you for your rating!");

    } catch (error) {
        alert("Failed to submit rating. Please try again.");
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(async () => {
    isLoading.value = true;
    try {
        await store.dispatch('transaction/fetchTransactionDetail', route.params.id);
    } catch (err) {
        console.error(err);
    } finally {
        isLoading.value = false;
    }
});
</script>

<template>
    <section class="max-w-4xl mx-auto my-8 px-4">
        <button @click="router.go(-1)" class="flex items-center text-slate-500 hover:text-slate-800 mb-6 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" class="w-4 h-4 mr-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Orders
        </button>
        <div v-if="isLoading" class="text-center py-20 text-slate-500">Loading Detail...</div>
        <div v-else-if="order" class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div class="p-6 border-b border-gray-100 bg-gray-50 flex flex-wrap justify-between items-center gap-4">
                <div>
                    <p class="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Order ID</p>
                    <p class="text-sm font-mono text-slate-800">{{ order.id }}</p>
                </div>
                <div>
                    <p class="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Date</p>
                    <p class="text-sm text-slate-800">{{ order.date }}</p>
                </div>
                <div>
                    <p class="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Total Amount</p>
                    <p class="text-lg font-bold text-teal-700">{{ formatRupiah(order.totalPrice) }}</p>
                </div>
            </div>
            <div class="p-6 border-b border-gray-100">
                <h3 class="font-semibold text-slate-900 mb-3">Shipping Details</h3>
                <div class="text-sm text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <span class="block text-xs text-slate-400">Recipient</span>
                        {{ order.shippingDetails?.fullname }} ({{ order.shippingDetails?.phone }})
                    </div>
                    <div>
                        <span class="block text-xs text-slate-400">Address</span>
                        {{ order.shippingDetails?.address }}, {{ order.shippingDetails?.city }} {{
                            order.shippingDetails?.postalCode }}
                    </div>
                </div>
            </div>

            <div class="p-6">
                <h3 class="font-semibold text-slate-900 mb-4">Product Items</h3>
                <div class="space-y-6">
                    <div v-for="(item, index) in order.items" :key="index"
                        class="flex flex-col sm:flex-row gap-4 border-b border-gray-50 last:border-0 pb-6 last:pb-0">
                        <img :src="item.image"
                            class="w-20 h-20 rounded-lg object-cover border border-gray-200 shrink-0">
                        <div class="flex-1">
                            <h4 class="font-medium text-slate-900">{{ item.title }}</h4>
                            <p class="text-sm text-slate-500 mb-1">Size: {{ item.size }}</p>
                            <p class="text-sm text-slate-500">{{ item.quantity }} x {{ formatRupiah(item.price) }}</p>
                            <div v-if="item.isRated"
                                class="mt-2 flex items-center gap-1 text-yellow-500 text-sm font-medium">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                    class="w-4 h-4">
                                    <path fill-rule="evenodd"
                                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.11c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z"
                                        clip-rule="evenodd" />
                                </svg>
                                {{ item.userRating?.score }}/5
                                <span class="text-slate-400 text-xs font-normal ml-1">You rated this</span>
                            </div>
                        </div>
                        <div class="flex flex-col sm:flex-row gap-2 items-center">
                            <router-link :to="`/product/${item.id}`">
                                <BaseButton
                                    class="text-sm bg-teal-50 text-teal-700 border border-teal-200 hover:bg-teal-100 px-4 py-2 rounded-lg transition w-full sm:w-auto">
                                    Buy Again
                                </BaseButton>
                            </router-link>
                            <BaseButton v-if="!item.isRated" @click="openRatingModal(item, index)"
                                class="text-sm bg-yellow-50 text-yellow-700 border border-yellow-200 hover:bg-yellow-100 px-4 py-2 rounded-lg transition w-full sm:w-auto">
                                <div class="flex items-center gap-1 justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                        class="w-4 h-4">
                                        <path fill-rule="evenodd"
                                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.11c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    Give Rating
                                </div>
                            </BaseButton>
                            <div v-else
                                class="hidden sm:block text-xs font-medium text-slate-400 bg-gray-50 px-3 py-2 rounded border border-gray-100">
                                Rated
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <RatingForm :isOpen="showRatingModal" :item="selectedItem" :isLoading="isSubmitting"
            @close="showRatingModal = false" @submit-rating="handleRatingSubmit" />
    </section>
</template>