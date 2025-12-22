<script setup>
import { onMounted, computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import BaseButton from '../ui/BaseButton.vue';
import ProductCard from '../ui/ProductCard.vue';
import BaseModal from '../ui/BaseModal.vue';

const route = useRoute();
const router = useRouter();
const store = useStore();
const isLoading = ref(false);
const showSuccessModal = ref(false);

const product = computed(() => store.getters['product/getProductDetail']);
const allProducts = computed(() => store.getters['product/getProducts']);
const isLiked = computed(() => {
    return store.getters['wishlist/isInWishlist'](String(route.params.id));
});
const reviews = computed(() => store.getters['product/getProductReviews']);
const averageRating = computed(() => store.getters['product/getAverageRating']);
const totalReviews = computed(() => store.getters['product/getTotalReviews']);

const fetchData = async () => {
    isLoading.value = true;
    try {
        const productId = route.params.id;
        await Promise.all([
            store.dispatch('product/fetchProductDetail', productId),
            store.dispatch('product/fetchProductReviews', productId)
        ]);
        if (allProducts.value.length === 0) {
            await store.dispatch('product/fetchProductData');
        }
    } catch (err) {
        console.error(err);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchData();
});

watch(() => route.params.id, () => {
    fetchData();
    window.scrollTo(0, 0);
});

const formattedPrice = computed(() => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.value?.price || 0);
});

const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const otherProducts = computed(() => {
    const currentId = route.params.id;
    return allProducts.value
        .filter(p => p.id !== currentId)
        .slice(0, 4);
});

const addToCart = () => {
    store.dispatch('cart/addToCart', product.value);
    showSuccessModal.value = true;
};

const buyNow = () => {
    store.dispatch('cart/buyNow', product.value);    
    router.push('/cart/checkout');
};

const handleWishlistClick = () => {
    const productId = String(route.params.id);
    store.dispatch('wishlist/toggleWishlist', productId);
};

const staticInfo = {
    condition: 'Very Good',
    location: 'Denpasar, Bali',
    uploaded: '5 hours ago',
};
</script>

<template>
    <div class="min-h-screen flex flex-col bg-white">
        <div v-if="isLoading" class="grow flex justify-center items-center py-20">
            <p class="text-slate-500">Loading product details...</p>
        </div>
        <main v-else-if="product && product.name" class="grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div class="rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                    <div class=" w-full">
                        <img :src="product.image" :alt="product.name" class="w-full h-full object-center object-cover">
                    </div>
                </div>
                <div class="flex flex-col">
                    <div class="flex justify-between items-start mb-4">
                        <h1 class="text-3xl font-bold text-slate-900">{{ formattedPrice }}</h1>
                        <button @click.prevent="handleWishlistClick"
                            class="flex items-center gap-1 group/btn transition-transform active:scale-95">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor" class="w-6 h-6 transition-colors duration-300"
                                :class="isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400 hover:text-red-500'">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                            </svg>
                        </button>
                    </div>
                    <h2 class="text-2xl font-medium text-slate-800 mb-3">{{ product.name }}</h2>
                    <div class="text-sm text-slate-500 flex items-center gap-2 mb-6 flex-wrap">
                        <span class="bg-gray-100 px-2 py-1 rounded">{{ product.size }} / {{ product.color }}</span> •
                        <span>{{ staticInfo.condition }}</span> •
                        <span>{{ staticInfo.location }}</span>
                    </div>
                    <div class="mb-8">
                        <h3 class="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wide">Item Description
                        </h3>
                        <p class="text-slate-600 text-sm leading-relaxed">
                            {{ product.description }}
                        </p>
                    </div>
                    <div class="mb-8 space-y-3 text-sm border-t border-b border-gray-100 py-4">
                        <div class="flex">
                            <span class="w-32 text-slate-500 font-medium">Category</span>
                            <span class="text-slate-900">{{ product.category }}</span>
                        </div>
                        <div class="flex">
                            <span class="w-32 text-slate-500 font-medium">Size</span>
                            <span class="text-slate-900">{{ product.size }}</span>
                        </div>
                        <div class="flex">
                            <span class="w-32 text-slate-500 font-medium">Condition</span>
                            <span class="text-slate-900">{{ staticInfo.condition }}</span>
                        </div>
                        <div class="flex">
                            <span class="w-32 text-slate-500 font-medium">Color</span>
                            <span class="text-slate-900">{{ product.color }}</span>
                        </div>
                        <div class="flex">
                            <span class="w-32 text-slate-500 font-medium">Uploaded</span>
                            <span class="text-slate-900">{{ staticInfo.uploaded }}</span>
                        </div>
                        <div class="flex">
                            <span class="w-32 text-slate-500 font-medium">Shipping</span>
                            <span class="text-slate-900">
                                {{ new Intl.NumberFormat('id-ID', {
                                    style: 'currency', currency: 'IDR',
                                    minimumFractionDigits: 0
                                }).format(product.shipping || 0) }}
                            </span>
                        </div>
                    </div>
                    <div class="flex flex-col gap-3 mb-8">
                        <BaseButton @click="buyNow"
                            class="w-full py-3 justify-center font-semibold text-base bg-[#178A8D] cursor-pointer text-white hover:bg-teal-800 transition shadow-md">
                            Buy Now
                        </BaseButton>
                        <BaseButton @click="addToCart"
                            class="w-full py-3 justify-center font-semibold text-base text-teal-700 border-2 border-teal-700 hover:bg-teal-50 transition">
                            Add to Cart
                        </BaseButton>
                    </div>
                    <div>
                        <h3 class="text-lg font-bold text-slate-900 mb-4">Reviews ({{ totalReviews }})</h3>
                        <div v-if="reviews.length > 0" class="space-y-4 max-h-56 overflow-y-auto">
                            <div v-for="(review, index) in reviews" :key="index"
                                class="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <div class="flex items-start justify-between mb-2">
                                    <div class="flex items-center gap-3">
                                        <img :src="review.avatar" class="w-8 h-8 rounded-full">
                                        <div>
                                            <p class="text-sm font-semibold text-slate-900">{{ review.username }}</p>
                                            <p class="text-xs text-slate-400">{{ formatDate(review.date) }}</p>
                                        </div>
                                    </div>
                                    <div class="flex text-yellow-400">
                                        <svg v-for="i in 5" :key="i" xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3"
                                            :class="i <= review.score ? 'text-yellow-400' : 'text-gray-300'">
                                            <path fill-rule="evenodd"
                                                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.11c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <p class="text-sm text-slate-600 italic">"{{ review.comment || 'No comment provided.'
                                    }}"</p>
                            </div>
                        </div>
                        <div v-else class="text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                            <p class="text-slate-500 text-sm">No reviews yet for this product.</p>
                        </div>
                    </div>
                </div>
            </div>
            <section class="mt-24 border-t border-gray-100 pt-10">
                <h2 class="text-2xl font-bold text-slate-900 mb-6">Other Product</h2>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <ProductCard v-for="item in otherProducts" :key="item.id" v-bind="item" />
                </div>
            </section>
        </main>
        <div v-else class="grow flex justify-center items-center py-20">
            <p class="text-slate-500">Product not found.</p>
        </div>
    </div>

    <base-modal :isOpen="showSuccessModal" @close="showSuccessModal = false">
        <div class="flex flex-col items-center text-center px-4 py-2">
            <img src="@/assets/images/add-to-cart.svg" alt="Success Icon" class="w-36 mb-6">
            <h1 class="text-xl font-bold text-slate-900 mb-2">
                Product successfully added to cart!
            </h1>
            <p class="text-slate-500 mb-8 max-w-xs mx-auto leading-relaxed text-sm">
                "{{ product?.name }}" successfully added to cart. Check now on the cart or continue shopping.
            </p>
            <div class="w-full max-w-xs flex flex-col gap-3">
                <router-link to="/" class="block w-full">
                    <base-button
                        class="w-full bg-white border border-teal-600 text-teal-600 hover:bg-teal-50 font-medium py-3 rounded-lg transition">
                        Continue Shopping
                    </base-button>
                </router-link>
                <router-link to="/cart" class="block w-full">
                    <base-button
                        class="w-full bg-teal-700 text-white hover:bg-teal-800 font-medium py-3 rounded-lg transition shadow-sm">
                        Go to Cart
                    </base-button>
                </router-link>
            </div>
        </div>
    </base-modal>
</template>