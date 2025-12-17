<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const emit = defineEmits(['changeTab']);
const props = defineProps({
    activeTab: String
});

const store = useStore();
const userData = computed(() => store.state.auth.userLogin);

const menus = [
    { id: 'profile', label: 'Profile', icon: 'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z' },
    { id: 'password', label: 'Change Password', icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z' },
    { id: 'transaction', label: 'Transaction History', icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z' },
];

const menuClicked = (id) => {
    emit('changeTab', id);
};
</script>

<template>
    <div class="w-full mb-6">
        <div class="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div class="p-4 border-b border-slate-100 flex items-center bg-slate-50">
                <img :src="userData?.imageLink || 'https://ui-avatars.com/api/?name=User'"
                    class="w-12 h-12 rounded-full object-cover border border-white shadow-sm" />
                <div class="ml-3 overflow-hidden">
                    <p class="text-sm font-bold text-slate-800 truncate">{{ userData?.fullname || 'User' }}</p>
                    <p class="text-xs text-slate-500 truncate">{{ userData?.email || 'email@example.com' }}</p>
                </div>
            </div>

            <ul class="flex flex-col">
                <li v-for="menu in menus" :key="menu.id" @click="menuClicked(menu.id)"
                    class="group flex items-center px-4 py-3.5 cursor-pointer transition-all duration-200 border-l-4"
                    :class="[activeTab === menu.id ? 'border-teal-600 bg-teal-50 text-teal-700 font-medium' : 'border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900']">
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