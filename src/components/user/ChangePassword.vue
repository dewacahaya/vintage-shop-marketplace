<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import BaseButton from '../ui/BaseButton.vue';

const store = useStore();
const isLoading = ref(false);

const currentUser = computed(() => store.state.auth.userLogin);

const form = ref({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
});

const handleChangePassword = async () => {
    // Validasi input
    if (!form.value.oldPassword || !form.value.newPassword || !form.value.confirmPassword) {
        alert("Please fill in all fields.");
        return;
    }

    if (form.value.newPassword.length < 6) {
        alert("New password must be at least 6 characters.");
        return;
    }

    if (form.value.newPassword !== form.value.confirmPassword) {
        alert("New password confirmation does not match.");
        return;
    }

    isLoading.value = true;
    try {
        // Panggil action dengan payload lengkap
        await store.dispatch("auth/changePassword", {
            email: currentUser.value.email,
            oldPassword: form.value.oldPassword,
            newPassword: form.value.newPassword
        });

        alert("Password changed successfully!");

        form.value.oldPassword = '';
        form.value.newPassword = '';
        form.value.confirmPassword = '';

    } catch (error) {
        console.error(error);
        if (error.response && error.response.data && error.response.data.error) {
            const errCode = error.response.data.error.message;
            if (errCode === "INVALID_PASSWORD" || errCode === "INVALID_LOGIN_CREDENTIALS") {
                alert("Old password is incorrect.");
            } else {
                alert("Failed to change password: " + errCode);
            }
        } else {
            alert("Failed to change password. Please try again.");
        }
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-8">
        <h2 class="text-xl font-bold text-slate-800 mb-6">Change Password</h2>
        <div class="space-y-6 max-w-lg">
            <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Old Password</label>
                <input v-model="form.oldPassword" type="password" placeholder="Enter current password"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition bg-white">
            </div>
            <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                <input v-model="form.newPassword" type="password" placeholder="Enter new password"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition bg-white">
            </div>
            <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                <input v-model="form.confirmPassword" type="password" placeholder="Confirm new password"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition bg-white">
            </div>
            <div class="pt-4 text-right">
                <BaseButton @click="handleChangePassword" :disabled="isLoading"
                    class="bg-teal-700 text-white hover:bg-teal-800 px-6 py-2.5 rounded-lg font-medium transition shadow-sm flex items-center justify-center ml-auto">
                    <span v-if="!isLoading">Change Password</span>
                    <span v-else>Processing...</span>
                </BaseButton>
            </div>
        </div>
    </div>
</template>