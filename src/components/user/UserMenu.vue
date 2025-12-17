<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
const activeTab = ref('profile');
const emit = defineEmits(['changeTab']);

const menus = [
    {
        id: 'profile',
        label: 'Profile',
        icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
    },
    {
        id: 'password',
        label: 'Change Password',
        icon: 'M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H432c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"'
    },
    {
        id: 'transaction',
        label: 'Transactions History',
        icon: 'M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
    },
];

const store = useStore();

const menuClicked = (id) => {
    activeTab.value = id;
    emit('changeTab', id);
};

const userData = computed(() => {
    return store.state.auth.userLogin;
})
</script>

<template>
    <div class="w-9/12 mb-6 ml-6">
        <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div class="p-4 border-b border-slate-100 flex items-center bg-slate-50">
                <img :src="userData.imageLink" alt="Profile"
                    class="w-12 h-12 rounded-full object-cover border border-white shadow-sm" />
                <div class="ml-3 overflow-hidden">
                    <p class="text-sm font-bold text-slate-800 mb-1 truncate">{{ userData.fullname }}</p>
                    <p class="text-xs text-slate-500 truncate">{{ userData.email }}</p>
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