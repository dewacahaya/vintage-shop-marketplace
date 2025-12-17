<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import UserMenu from '../user/UserMenu.vue';
import EditProfile from '../user/EditProfile.vue';
import ChangePassword from '../user/ChangePassword.vue';
import TransactionHistory from '../user/TransactionHistory.vue';

const route = useRoute();
const router = useRouter();
const currentTab = ref('profile');

onMounted(() => {
    if (route.params.component) {
        currentTab.value = route.params.component;
    }
});

const handleTabChange = (tabId) => {
    currentTab.value = tabId;
    router.push(`/user/${tabId}`);
};

watch(() => route.params.component, (newVal) => {
    if (newVal) {
        currentTab.value = newVal;
    }
});
</script>

<template>
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 class="text-3xl font-bold text-slate-900 mb-8">Settings</h1>

        <div class="flex flex-col lg:flex-row gap-8">
            <div class="lg:w-1/4">
                <UserMenu :activeTab="currentTab" @changeTab="handleTabChange" />
            </div>

            <div class="lg:w-3/4">
                <EditProfile v-if="currentTab === 'profile'" />
                <ChangePassword v-else-if="currentTab === 'password'" />
                <TransactionHistory v-else-if="currentTab === 'transaction'" />
            </div>
        </div>
    </div>
</template>