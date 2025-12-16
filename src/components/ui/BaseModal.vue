<script setup>
defineProps({
    isOpen: {
        type: Boolean,
        required: true
    }
});

defineEmits(['close']);
</script>

<template>
    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isOpen"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                @click.self="$emit('close')">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-md p-8 relative transform transition-all">

                    <button @click="$emit('close')"
                        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <slot />
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
/* Animasi Transisi Vue */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Sedikit efek zoom pada kartu saat muncul */
.fade-enter-active .bg-white,
.fade-leave-active .bg-white {
    transition: transform 0.3s ease;
}

.fade-enter-from .bg-white,
.fade-leave-to .bg-white {
    transform: scale(0.95);
}
</style>