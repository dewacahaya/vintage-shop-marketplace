<script setup>
import { ref } from 'vue';
import UserMenu from '../user/UserMenu.vue';
import EditProfile from '../user/EditProfile.vue';

const currentTab = ref('profile');

const handleTabChange = (tabId) => {
    currentTab.value = tabId;
};
</script>

<template>
    <div class="grow container w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 class="text-3xl font-bold text-slate-900 mb-8">Settings</h1>
        <div class="flex flex-col lg:flex-row gap-8">
            <div class="lg:w-1/3">
                <UserMenu @changeTab="handleTabChange" />
            </div>
            <div class="lg:w-2/3">
                <EditProfile v-if="currentTab === 'profile'" />
                <div v-else-if="currentTab === 'password'" class="bg-white p-8 rounded-xl border border-gray-200">
                    <p class="text-slate-500">Change Password Component goes here...</p>
                </div>
                <div v-else-if="currentTab === 'transaction'" class="bg-white p-8 rounded-xl border border-gray-200">
                    <p class="text-slate-500">Transaction History Component goes here...</p>
                </div>
            </div>

        </div>
    </div>
</template>