<script setup>
import { ref } from 'vue';

// State untuk melacak menu mana yang sedang aktif
const activeTab = ref('personal-info');

// Emit ke parent agar halaman di sebelah kanan bisa berubah sesuai menu
const emit = defineEmits(['changeTab']);

// Data Menu (Agar kodingan HTML lebih rapi & tidak berulang)
const menus = [
    {
        id: 'personal-info',
        label: 'Personal Info',
        icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
    },
    {
        id: 'favorite-recipes',
        label: 'Favorited Recipes', // (Bisa diganti 'Wishlist' untuk toko baju)
        icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
    },
    {
        id: 'user-recipes',
        label: 'My Recipe', // (Bisa diganti 'Order History' untuk toko baju)
        icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25'
    },
];

const menuClicked = (id) => {
    activeTab.value = id;
    emit('changeTab', id);
};
</script>

<template>
    <div class="w-full md:w-1/4 mb-6 ml-6 mt-6">
        <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">

            <div class="p-4 border-b border-slate-100 flex items-center bg-slate-50">
                <img src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp" alt="Profile"
                    class="w-12 h-12 rounded-full object-cover border border-white shadow-sm" />
                <div class="ml-3 overflow-hidden">
                    <p class="text-sm font-bold text-slate-800 truncate">Haloo</p>
                    <p class="text-xs text-slate-500 truncate">ajbjhajhaj@gmail.com</p>
                </div>
            </div>

            <ul class="flex flex-col">
                <li v-for="menu in menus" :key="menu.id" @click="menuClicked(menu.id)"
                    class="group flex items-center px-4 py-3.5 cursor-pointer transition-all duration-200 border-l-4"
                    :class="[
                        activeTab === menu.id
                            ? 'border-teal-600 bg-teal-50 text-teal-700 font-medium'
                            : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    ]">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-5 h-5 mr-3 transition-colors"
                        :class="activeTab === menu.id ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'">
                        <path stroke-linecap="round" stroke-linejoin="round" :d="menu.icon" />
                    </svg>

                    <span class="text-sm">{{ menu.label }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>