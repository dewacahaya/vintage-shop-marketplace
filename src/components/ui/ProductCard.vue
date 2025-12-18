<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const props = defineProps({
    id: [String, Number],
    image: String,
    name: String,
    price: [Number, String],
    size: String,
    color: String,
    stock: Number
});

const store = useStore();

const isLiked = computed(() => {
    return store.getters['wishlist/isInWishlist'](String(props.id));
});

const formattedPrice = computed(() => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(props.price || 0);
});

const handleWishlistClick = () => {
    store.dispatch('wishlist/toggleWishlist', props.id);
};
</script>

<template>
    <router-link :to="`/product/${id}`"
        class="block bg-white rounded-xl overflow-hidden hover:shadow-lg transition duration-300 cursor-pointer group border border-transparent hover:border-teal-50 relative">
        <div class="aspect-4/5 bg-gray-100 relative overflow-hidden">
            <img :src="image" :alt="name"
                class="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                loading="lazy" />

            <div v-if="stock <= 0" class="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span class="text-white font-bold text-sm bg-red-600 px-3 py-1 rounded">SOLD</span>
            </div>
        </div>
        <div class="p-3 flex flex-col gap-1">
            <p class="text-[#178A8D] font-bold text-lg">
                {{ formattedPrice }}
            </p>
            <h3 class="font-medium text-slate-700 text-sm truncate" :title="name">
                {{ name }}
            </h3>
            <div class="flex justify-between items-center mt-2">
                <p class="text-xs text-slate-400">
                    {{ size }} / {{ color }}
                </p>
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
        </div>
    </router-link>
</template>