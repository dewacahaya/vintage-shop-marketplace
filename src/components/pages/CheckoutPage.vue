<script setup>
import { reactive, computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import BaseButton from '../ui/BaseButton.vue';
import BaseModal from '../ui/BaseModal.vue';

const store = useStore();
const router = useRouter();

const cartItems = computed(() => store.getters['cart/getCartItems']);
const cartSubtotal = computed(() => store.getters['cart/getCartSubtotal']);
const productShippingCost = computed(() => store.getters['cart/getCartShipping']);

const deliveryOptions = [
    {
        id: 'standard',
        name: 'Standard Delivery',
        price: 10000,
        eta: '3-5 working days',
        icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-3.375h-5.845a2.025 2.025 0 00-1.94 1.568l-.826 3.036A2.25 2.25 0 015.36 18.75h-.375'
    },
    {
        id: 'express',
        name: 'Fedex Express Shipping',
        price: 20000,
        eta: '1-3 working days',
        icon: 'M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z'
    }
];

const paymentOptions = [
    { id: 'credit_card', name: 'Credit Card', desc: 'Visa, Mastercard', logo: 'visa' },
    { id: 'transfer', name: 'Bank Transfer', desc: 'BCA, Mandiri, BNI', logo: 'bank' },
    { id: 'cod', name: 'Cash on Delivery', desc: 'Pay when items arrive', logo: 'cod' }
];

const form = reactive({
    fullname: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryId: 'express',
    paymentMethod: 'credit_card'
});

const courierCost = computed(() => {
    const option = deliveryOptions.find(opt => opt.id === form.deliveryId);
    return option ? option.price : 0;
});

const totalShippingCost = computed(() => {
    return productShippingCost.value + courierCost.value;
});

const finalGrandTotal = computed(() => {
    return cartSubtotal.value + totalShippingCost.value;
});

const showSuccessModal = ref(false);
const isProcessing = ref(false);

onMounted(() => {
    if (cartItems.value.length === 0) {
        router.push('/products');
    }
});

const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

const handleSubmit = async () => {
    if (!form.fullname || !form.address || !form.phone || !form.city || !form.postalCode) {
        alert("Please complete all shipping details.");
        return;
    }
    isProcessing.value = true;
    try {
        await store.dispatch('cart/confirmCheckout', {
            ...form,
            shippingCost: totalShippingCost.value,
            grandTotal: finalGrandTotal.value
        });
        showSuccessModal.value = true;
    } catch (error) {
        console.error(error);
        alert("Checkout Failed: " + error.message);
    } finally {
        isProcessing.value = false;
    }
};

const finishOrder = () => {
    showSuccessModal.value = false;
    router.push('/');
};
</script>

<template>
    <div class="min-h-screen flex flex-col bg-gray-50">
        <div class="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-10">
            <div class="container mx-auto max-w-6xl">
                <router-link to="/cart"
                    class="flex items-center text-slate-500 hover:text-slate-800 transition text-sm font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" class="w-4 h-4 mr-1">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to Cart
                </router-link>
            </div>
        </div>

        <main class="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-6xl">
            <h1 class="text-2xl font-bold text-slate-900 mb-8">Checkout</h1>
            <div class="flex flex-col lg:flex-row gap-8">
                <div class="lg:w-2/3">
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                        <h2 class="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                            <span class="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 rounded mr-2">1</span>
                            Shipping Address
                        </h2>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="col-span-2 md:col-span-1">
                                <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input v-model="form.fullname" type="text"
                                    class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none transition"
                                    placeholder="Enter your name">
                            </div>
                            <div class="col-span-2 md:col-span-1">
                                <label class="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                <input v-model="form.phone" type="tel"
                                    class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none transition"
                                    placeholder="0812...">
                            </div>
                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-slate-700 mb-1">Full Address</label>
                                <textarea v-model="form.address" rows="3"
                                    class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none transition"
                                    placeholder="Street name, house number..."></textarea>
                            </div>
                            <div class="col-span-2 md:col-span-1">
                                <label class="block text-sm font-medium text-slate-700 mb-1">City</label>
                                <input v-model="form.city" type="text"
                                    class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none transition"
                                    placeholder="e.g. Denpasar">
                            </div>
                            <div class="col-span-2 md:col-span-1">
                                <label class="block text-sm font-medium text-slate-700 mb-1">Postal Code</label>
                                <input v-model="form.postalCode" type="text"
                                    class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 outline-none transition"
                                    placeholder="e.g. 80117">
                            </div>
                        </div>
                    </div>
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                        <h2 class="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                            <span class="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 rounded mr-2">2</span>
                            Delivery Details
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label v-for="option in deliveryOptions" :key="option.id"
                                class="relative flex p-4 border rounded-xl cursor-pointer transition hover:border-teal-500"
                                :class="form.deliveryId === option.id ? 'border-teal-600 bg-teal-50 ring-1 ring-teal-600' : 'border-gray-200'">
                                <input type="radio" v-model="form.deliveryId" :value="option.id" class="sr-only">
                                <div class="flex items-start gap-3 w-full">
                                    <div
                                        class="p-2 bg-white rounded-full border border-gray-200 text-teal-600 shrink-0">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" :d="option.icon" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p class="font-semibold text-slate-900 text-sm">{{ option.name }}</p>
                                        <p class="text-teal-700 font-bold text-sm">+ {{ formatRupiah(option.price) }}
                                        </p>
                                        <p class="text-xs text-slate-500 mt-1 flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke-width="1.5" stroke="currentColor" class="w-3 h-3 mr-1">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {{ option.eta }}
                                        </p>
                                    </div>
                                    <div v-if="form.deliveryId === option.id"
                                        class="absolute top-4 right-4 text-teal-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                            class="w-5 h-5">
                                            <path fill-rule="evenodd"
                                                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 class="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                            <span class="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 rounded mr-2">3</span>
                            Payment Method
                        </h2>
                        <div class="space-y-3">
                            <label v-for="method in paymentOptions" :key="method.id"
                                class="flex items-center p-4 border rounded-xl cursor-pointer transition hover:border-teal-500"
                                :class="form.paymentMethod === method.id ? 'border-teal-600 bg-teal-50 ring-1 ring-teal-600' : 'border-gray-200'">
                                <input type="radio" v-model="form.paymentMethod" :value="method.id" class="sr-only">
                                <div
                                    class="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center mr-4 shrink-0">
                                    <span v-if="method.id === 'credit_card'"
                                        class="text-blue-700 font-bold italic text-xs">VISA</span>
                                    <svg v-else-if="method.id === 'transfer'" xmlns="http://www.w3.org/2000/svg"
                                        fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
                                        class="w-5 h-5 text-slate-600">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                                    </svg>
                                    <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="w-5 h-5 text-green-600">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 2.025v1.5c0 .414.336.75.75.75H4.5a.75.75 0 01-.75-.75v-1.5" />
                                    </svg>
                                </div>
                                <div class="flex-1">
                                    <span class="block text-sm font-medium text-slate-900">{{ method.name }}</span>
                                    <span class="block text-xs text-slate-500">{{ method.desc }}</span>
                                </div>
                                <div v-if="form.paymentMethod === method.id" class="text-teal-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                                        class="w-5 h-5">
                                        <path fill-rule="evenodd"
                                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="lg:w-1/3">
                    <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm sticky top-24">
                        <h2 class="font-semibold text-slate-900 mb-4 text-lg">Order Summary</h2>
                        <div class="max-h-60 overflow-y-auto mb-4 pr-1 space-y-4">
                            <div v-for="item in cartItems" :key="item.id" class="flex gap-3">
                                <img :src="item.image" class="w-12 h-12 rounded object-cover border border-gray-100">
                                <div class="flex-1">
                                    <p class="text-sm font-medium text-slate-800 line-clamp-1">{{ item.title }}</p>
                                    <p class="text-xs text-slate-500">{{ item.quantity }} x {{ formatRupiah(item.price)
                                        }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="border-t border-gray-100 my-4"></div>
                        <div class="space-y-2 text-sm">
                            <div class="flex justify-between">
                                <span class="text-slate-500">Subtotal</span>
                                <span class="font-medium text-slate-900">{{ formatRupiah(cartSubtotal) }}</span>
                            </div>
                            <div class="flex justify-between text-xs text-gray-400">
                                <span>Product Shipping</span>
                                <span>{{ formatRupiah(productShippingCost) }}</span>
                            </div>
                            <div class="flex justify-between text-xs text-gray-400">
                                <span>Courier Fee</span>
                                <span>{{ formatRupiah(courierCost) }}</span>
                            </div>

                            <div class="flex justify-between border-t border-dashed border-gray-200 pt-2 mt-2">
                                <span class="text-slate-500">Total Shipping</span>
                                <span class="font-medium text-slate-900">{{ formatRupiah(totalShippingCost) }}</span>
                            </div>
                        </div>
                        <div class="border-t border-gray-200 my-4"></div>
                        <div class="flex justify-between font-bold text-slate-900 mb-6 text-lg">
                            <span>Total</span>
                            <span class="text-teal-700">{{ formatRupiah(finalGrandTotal) }}</span>
                        </div>
                        <BaseButton @click="handleSubmit" :disabled="isProcessing"
                            class="w-full bg-teal-700 text-white py-3.5 rounded-lg font-bold hover:bg-teal-800 transition shadow-lg transform active:scale-95 flex justify-center items-center">
                            <span v-if="!isProcessing">Confirm Order</span>
                            <span v-else>Processing...</span>
                        </BaseButton>
                    </div>
                </div>
            </div>
        </main>

        <BaseModal :isOpen="showSuccessModal">
            <div class="flex flex-col items-center text-center px-4 py-4">
                <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" class="w-10 h-10 text-green-600">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                <h1 class="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
                <p class="text-slate-500 mb-8 max-w-xs mx-auto text-sm">
                    Thank you for your order, <strong>{{ form.fullname }}</strong>. We have received your order and will
                    process it immediately.
                </p>
                <BaseButton @click="finishOrder"
                    class="w-full bg-teal-700 text-white hover:bg-teal-800 font-medium py-3 rounded-lg transition">
                    Back to Home
                </BaseButton>
            </div>
        </BaseModal>
    </div>
</template>