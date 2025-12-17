<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import BaseModal from '../ui/BaseModal.vue';
import BaseButton from '../ui/BaseButton.vue';

const store = useStore();
const router = useRouter();

const currentUser = computed(() => store.state.auth.userLogin);

const userAvatar = computed(() => {
    return currentUser.value?.imageLink || 'https://ui-avatars.com/api/?name=User&background=178A8D&color=fff';
});

const showDropdown = ref(false);
const showLogoutModal = ref(false);

const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
};

const openLogoutConfirmation = () => {
    showDropdown.value = false;
    showLogoutModal.value = true;
};

const handleLogout = () => {
    store.commit('auth/setUserLogout');
    showLogoutModal.value = false;
    router.push('/');
};

const cartCount = computed(() => store.getters['cart/getCartCount']);
const wishlistCount = ref(1);
</script>

<template>
    <div class="flex items-center gap-5 text-slate-600">
        <router-link to="/cart" class="relative hover:text-teal-600 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            <span v-if="cartCount > 0"
                class="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                {{ cartCount }}
            </span>
        </router-link>

        <router-link to="/wishlist" class="relative hover:text-red-500 transition">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span v-if="wishlistCount > 0"
                class="absolute -top-1 -right-2 bg-red-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                {{ wishlistCount }}
            </span>
        </router-link>

        <div class="relative">
            <div @click="toggleDropdown"
                class="flex items-center gap-2 cursor-pointer ml-2 hover:opacity-80 transition select-none">
                <img :src="userAvatar" alt="User Avatar"
                    class="w-8 h-8 rounded-full object-cover border border-slate-200 bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-4 h-4 text-slate-500 transition-transform duration-200"
                    :class="{ 'rotate-180': showDropdown }">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </div>

            <div v-if="showDropdown"
                class="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                <div class="px-4 py-2 border-b border-gray-100">
                    <p class="text-sm font-semibold text-slate-800 truncate">{{ currentUser?.fullname || 'User' }}</p>
                </div>
                <router-link to="/user/profile" @click="showDropdown = false"
                    class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    My Profile
                </router-link>
                <router-link to="/user/orders" @click="showDropdown = false"
                    class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
                    My Orders
                </router-link>
                <div class="border-t border-gray-100 my-1"></div>
                
                <button @click="openLogoutConfirmation" class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    Logout
                </button>
            </div>
        </div>
    </div>

    <base-modal :isOpen="showLogoutModal" @close="showLogoutModal = false">
        <div class="w-full flex flex-col items-center justify-center px-4 py-2 text-center">
            <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9m7.5 0A2.25 2.25 0 0118 11.25v6.75A2.25 2.25 0 0115.75 20.25H8.25A2.25 2.25 0 016 18V11.25A2.25 2.25 0 018.25 9m7.5 0v-.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
            </div>
            <h1 class="text-xl font-bold text-slate-900 mb-2">Are you sure to <span class="text-red-600">Logout</span>?</h1>
            <p class="text-slate-500 mb-6 text-sm">
                You will be logged out of your account. You need to login again to access your profile.
            </p>
            <div class="flex gap-3 w-full">
                <base-button 
                    @click="showLogoutModal = false"
                    class="flex-1 bg-gray-100 text-slate-700 hover:bg-gray-200 py-2.5 rounded-lg font-medium transition">
                    Cancel
                </base-button>        
                <base-button 
                    @click="handleLogout"
                    class="flex-1 bg-red-600 text-white hover:bg-red-700 py-2.5 rounded-lg font-medium transition shadow-sm">
                    Logout
                </base-button>
            </div>
        </div>
    </base-modal>
</template>