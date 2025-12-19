<script setup>
import { ref, watch } from 'vue';
import BaseModal from '..//ui/BaseModal.vue';
import BaseButton from '../ui/BaseButton.vue';

const props = defineProps({
    isOpen: Boolean,
    item: Object,
    isLoading: Boolean
});

const emit = defineEmits(['close', 'submit-rating']);

const rating = ref(0);
const review = ref('');
const hoverRating = ref(0);

watch(() => props.isOpen, (newVal) => {
    if (newVal) {
        rating.value = 0;
        review.value = '';
    }
});

const setRating = (val) => {
    rating.value = val;
};

const submit = () => {
    if (rating.value === 0) {
        alert("Please select a star rating.");
        return;
    }
    emit('submit-rating', {
        rating: rating.value,
        review: review.value
    });
};
</script>

<template>
    <BaseModal :isOpen="isOpen" @close="$emit('close')">
        <div class="p-6 w-full max-w-md mx-auto">
            <div class="text-center mb-6">
                <h2 class="text-xl font-bold text-slate-900">Give Rating</h2>
                <p class="text-slate-500 text-sm">How was your experience with this product?</p>
            </div>
            <div v-if="item" class="flex items-center gap-4 bg-gray-50 p-3 rounded-lg mb-6 border border-gray-100">
                <img :src="item.image" class="w-14 h-14 rounded-md object-cover border border-gray-200">
                <div class="text-left">
                    <p class="font-semibold text-slate-800 text-sm line-clamp-1">{{ item.title }}</p>
                    <p class="text-xs text-slate-500">{{ item.size }} / {{ item.color }}</p>
                </div>
            </div>
            <div class="flex justify-center gap-2 mb-6">
                <button v-for="star in 5" :key="star" type="button" @click="setRating(star)"
                    @mouseenter="hoverRating = star" @mouseleave="hoverRating = 0"
                    class="transition-transform hover:scale-110 focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                        class="w-10 h-10 transition-colors duration-200"
                        :class="(hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-200'">
                        <path fill-rule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.11c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z"
                            clip-rule="evenodd" />
                    </svg>
                </button>
            </div>
            <div class="mb-6">
                <label class="block text-sm font-medium text-slate-700 mb-2">Write a review (optional)</label>
                <textarea v-model="review" rows="3"
                    class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-teal-500 outline-none resize-none"
                    placeholder="Tell us what you liked or disliked..."></textarea>
            </div>
            <div class="flex gap-3">
                <BaseButton @click="$emit('close')"
                    class="w-full bg-white border border-gray-300 text-slate-600 hover:bg-gray-50 py-2.5 rounded-lg font-medium">
                    Cancel
                </BaseButton>
                <BaseButton @click="submit" :disabled="isLoading"
                    class="w-full bg-teal-700 text-white hover:bg-teal-800 py-2.5 rounded-lg font-medium flex justify-center items-center">
                    <span v-if="!isLoading">Submit Review</span>
                    <span v-else>Processing...</span>
                </BaseButton>
            </div>
        </div>
    </BaseModal>
</template>