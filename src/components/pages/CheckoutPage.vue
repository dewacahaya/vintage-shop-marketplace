<script setup>
import { reactive, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import BaseButton from '../ui/BaseButton.vue';
import BaseModal from '../ui/BaseModal.vue';

const store = useStore();
const router = useRouter();

const cartItems = computed(() => store.getters['cart/getCartItems']);
const cartSubtotal = computed(() => store.getters['cart/getCartSubtotal']);
const cartShipping = computed(() => store.getters['cart/getCartShipping']);
const cartGrandTotal = computed(() => store.getters['cart/getCartGrandTotal']);

const form = reactive({
    fullname: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'transfer'
});

const showSuccessModal = reactive({ value: false });

onMounted(() => {
    if (cartItems.value.length === 0) {
        alert("Your cart is empty");
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
    try {
        await store.dispatch('cart/confirmCheckout', {
            fullname: form.fullname,
            phone: form.phone,
            address: form.address,
            city: form.city,
            postalCode: form.postalCode,
            paymentMethod: form.paymentMethod
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
                            Shipping Details
                        </h2>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="col-span-2 md:col-span-1">
                                <label class="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                <input v-model="form.fullname" type="text"
                                    class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                                    placeholder="Enter your name">
                            </div>

                            <div class="col-span-2 md:col-span-1">
                                <label class="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                <input v-model="form.phone" type="tel"
                                    class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                                    placeholder="0812...">
                            </div>

                            <div class="col-span-2">
                                <label class="block text-sm font-medium text-slate-700 mb-1">Full Address</label>
                                <textarea v-model="form.address" rows="3"
                                    class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                                    placeholder="Street name, house number..."></textarea>
                            </div>

                            <div class="col-span-2 md:col-span-1">
                                <label class="block text-sm font-medium text-slate-700 mb-1">City</label>
                                <input v-model="form.city" type="text"
                                    class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                                    placeholder="e.g. Denpasar">
                            </div>

                            <div class="col-span-2 md:col-span-1">
                                <label class="block text-sm font-medium text-slate-700 mb-1">Postal Code</label>
                                <input v-model="form.postalCode" type="text"
                                    class="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                                    placeholder="e.g. 80117">
                            </div>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 class="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                            <span class="bg-teal-100 text-teal-800 text-xs font-bold px-2 py-1 rounded mr-2">2</span>
                            Payment Method
                        </h2>
                        <div class="space-y-3">
                            <label
                                class="flex items-center p-4 border rounded-lg cursor-pointer transition hover:border-teal-500"
                                :class="{ 'border-teal-600 bg-teal-50': form.paymentMethod === 'transfer' }">
                                <input type="radio" v-model="form.paymentMethod" value="transfer"
                                    class="text-teal-600 focus:ring-teal-500">
                                <div class="ml-3">
                                    <span class="block text-sm font-medium text-slate-900">Bank Transfer</span>
                                    <span class="block text-xs text-slate-500">BCA, Mandiri, BNI</span>
                                </div>
                            </label>
                            <label
                                class="flex items-center p-4 border rounded-lg cursor-pointer transition hover:border-teal-500"
                                :class="{ 'border-teal-600 bg-teal-50': form.paymentMethod === 'cod' }">
                                <input type="radio" v-model="form.paymentMethod" value="cod"
                                    class="text-teal-600 focus:ring-teal-500">
                                <div class="ml-3">
                                    <span class="block text-sm font-medium text-slate-900">Cash on Delivery (COD)</span>
                                    <span class="block text-xs text-slate-500">Pay when items arrive</span>
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
                            <div class="flex justify-between">
                                <span class="text-slate-500">Shipping</span>
                                <span class="font-medium text-slate-900">{{ formatRupiah(cartShipping) }}</span>
                            </div>
                        </div>

                        <div class="border-t border-gray-200 my-4"></div>

                        <div class="flex justify-between font-bold text-slate-900 mb-6 text-lg">
                            <span>Total</span>
                            <span class="text-teal-700">{{ formatRupiah(cartGrandTotal) }}</span>
                        </div>

                        <BaseButton @click="handleSubmit"
                            class="w-full bg-teal-700 text-white py-3.5 rounded-lg font-bold hover:bg-teal-800 transition shadow-lg transform active:scale-95">
                            Confirm Order
                        </BaseButton>

                        <p class="text-xs text-center text-slate-400 mt-4 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-3 h-3 mr-1">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                            Secure Checkout
                        </p>
                    </div>
                </div>
            </div>
        </main>

        <BaseModal :isOpen="showSuccessModal.value">
            <div class="flex flex-col items-center text-center px-4 py-4">
                <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" class="w-10 h-10 text-green-600">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                </div>
                <h1 class="text-2xl font-bold text-slate-900 mb-2">Order placed successfully!</h1>
                <p class="text-slate-500 mb-8 max-w-xs mx-auto text-sm">
                    Thank you for your order, <strong>{{ form.fullname }}</strong>. For do online shopping at Vintage.
                    You can track and see your order on transaction history menu.
                </p>
                <BaseButton @click="finishOrder"
                    class="w-full bg-teal-700 text-white hover:bg-teal-800 font-medium py-3 rounded-lg transition">
                    Back to Home
                </BaseButton>
            </div>
        </BaseModal>
    </div>
</template>