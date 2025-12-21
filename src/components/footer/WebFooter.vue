<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const showFooter = computed(() => {
    const hideRoutes = ['login', 'signup'];
    return !hideRoutes.includes(route.name);
});
</script>

<template>
    <footer v-if="showFooter" class="bottom-0 left-0 w-full bg-[#0C6B6D] text-white py-16">
        <div class="max-w-7xl mx-auto px-6">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-12">
                <div>
                    <h3 class="font-semibold text-lg mb-4">Vintage</h3>
                    <ul class="space-y-3 text-gray-200">
                        <li class="hover:text-white cursor-pointer">About us</li>
                        <li class="hover:text-white cursor-pointer">Sustainability</li>
                        <li class="hover:text-white cursor-pointer">Blog</li>
                        <li class="hover:text-white cursor-pointer">Advertising</li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-semibold text-lg mb-4">Discover</h3>
                    <ul class="space-y-3 text-gray-200">
                        <li class="hover:text-white cursor-pointer">How it works</li>
                        <li class="hover:text-white cursor-pointer">Help center</li>
                        <li class="hover:text-white cursor-pointer">Infoboard</li>
                        <li class="hover:text-white cursor-pointer">Mobile apps</li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-semibold text-lg mb-4">Help</h3>
                    <ul class="space-y-3 text-gray-200">
                        <li class="hover:text-white cursor-pointer">Help center</li>
                        <li class="hover:text-white cursor-pointer">Buying</li>
                        <li class="hover:text-white cursor-pointer">Trust & Safety</li>
                    </ul>
                </div>
                <div>
                    <h3 class="font-semibold text-lg mb-4">Community</h3>
                    <ul class="space-y-3 text-gray-200">
                        <li class="hover:text-white cursor-pointer">Forum</li>
                    </ul>
                </div>
            </div>
            <div class="border-t border-[#178A8D] mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center">
                <div class="flex items-center gap-6 text-2xl">
                    <i class="bi bi-whatsapp hover:text-white cursor-pointer"></i>
                    <i class="bi bi-instagram hover:text-white cursor-pointer"></i>
                    <i class="bi bi-linkedin hover:text-white cursor-pointer"></i>
                </div>
                <p class="text-sm text-gray-200 mt-4 sm:mt-0">
                    © Vintage, 2025
                </p>
            </div>
        </div>
    </footer>
</template>

<style scoped></style>
