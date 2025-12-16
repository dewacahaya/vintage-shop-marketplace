<script setup>
import { computed } from 'vue';

const props = defineProps({
    id: [String, Number],
    image: String,
    name: String,
    price: [Number, String],
    size: String,
    color: String
});

const formattedPrice = computed(() => {
    if (!props.price) return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(0);
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(props.price);
});

const subtitle = computed(() => {
    const parts = [];
    if (props.size) parts.push(props.size);
    if (props.color) parts.push(props.color);
    return parts.join(' / ');
});
</script>

<template>
    <router-link :to="`/product/${id}`"
        class="block p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition duration-300 cursor-pointer group border border-transparent hover:border-teal-50">
        <div class="aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4 relative">
            <img :src="image" :alt="name"
                class="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                loading="lazy" />
        </div>
        <div>
            <h3 class="font-semibold text-slate-900 text-lg truncate" :title="name">
                {{ name }}
            </h3>
            <p class="text-sm text-slate-500 mb-2 truncate">
                {{ subtitle }}
            </p>
            <p class="text-[#178A8D] font-bold text-base">
                {{ formattedPrice }}
            </p>
        </div>
    </router-link>
</template>

<style scoped></style>