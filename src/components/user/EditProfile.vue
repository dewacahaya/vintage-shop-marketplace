<script setup>
import { ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import BaseButton from '../ui/BaseButton.vue';

const store = useStore();
const fileInput = ref(null);
const isLoading = ref(false);

const currentUser = computed(() => store.state.auth.userLogin);

const form = ref({
    userId: '',
    fullname: '',
    username: '',
    email: '',
    imageLink: '',
    file: null
});

watch(currentUser, (newData) => {
    if (newData) {
        form.value.userId = newData.userId;
        form.value.fullname = newData.fullname || '';
        form.value.username = newData.username || '';
        form.value.email = newData.email || '';
        form.value.imageLink = newData.imageLink || '';
    }
}, { immediate: true });

const triggerFileInput = () => {
    fileInput.value.click();
};

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        if (file.size > 1024 * 1024) {
            alert("File size exceeds 1MB!");
            return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            form.value.imageLink = e.target.result;
            form.value.file = file;
        };
    }
};

const removeImage = () => {
    form.value.imageLink = `https://ui-avatars.com/api/?name=${form.value.fullname}&background=random`;
    form.value.file = null;
    if (fileInput.value) fileInput.value.value = '';
};

const handleUpdate = async () => {
    isLoading.value = true;
    try {
        const payload = {
            userId: form.value.userId,
            fullname: form.value.fullname,
            username: form.value.username,
            email: form.value.email,
            imageLink: form.value.imageLink,
        };
        await store.dispatch("auth/updateUser", payload);
        alert("Profile updated successfully!");
    } catch (error) {
        console.error(error);
        alert("Failed to update profile.");
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="bg-white border border-slate-200 rounded-xl shadow-sm p-6 sm:p-8">
        <h2 class="text-xl font-bold text-slate-800 mb-6">Edit Profile</h2>

        <div class="flex flex-col sm:flex-row items-center gap-6 mb-8 border-b border-slate-100 pb-8">
            <div class="shrink-0">
                <img :src="form.imageLink || 'https://ui-avatars.com/api/?name=User'" alt="Profile Photo"
                    class="w-20 h-20 rounded-full object-cover border-2 border-slate-100">
            </div>
            <div class="flex flex-col gap-2">
                <span class="font-semibold text-slate-900">Photo</span>
                <div class="flex items-center gap-3">
                    <BaseButton @click="triggerFileInput"
                        class="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-gray-100 transition">
                        Choose
                    </BaseButton>
                    <input type="file" ref="fileInput" class="hidden" accept="image/png, image/jpeg, image/jpg"
                        @change="handleFileChange">

                    <BaseButton @click="removeImage" class="p-2 text-slate-400 hover:text-red-500 transition">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="w-5 h-5">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </BaseButton>
                </div>
                <p class="text-xs text-slate-500 mt-1">JPG, JPEG or PNG, 1 MB max.</p>
            </div>
        </div>

        <div class="space-y-6 max-w-lg">
            <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Full name</label>
                <input v-model="form.fullname" type="text"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition bg-white">
            </div>
            <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Username</label>
                <input v-model="form.username" type="text"
                    class="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-slate-800 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition bg-white">
            </div>
            <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <input v-model="form.email" type="email" readonly
                    class="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-slate-500 cursor-not-allowed outline-none">
            </div>
            <div class="pt-4 text-right">
                <BaseButton @click="handleUpdate" :disabled="isLoading"
                    class="bg-teal-700 text-white hover:bg-teal-800 px-6 py-2.5 rounded-lg font-medium transition shadow-sm flex items-center justify-center ml-auto">
                    <span v-if="!isLoading">Update Profile</span>
                    <span v-else>Updating...</span>
                </BaseButton>
            </div>

        </div>
    </div>
</template>