<script setup>
import { reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import BaseModal from '../ui/BaseModal.vue';
import BaseInput from '../ui/BaseInput.vue';
import BaseButton from '../ui/BaseButton.vue';

const store = useStore();
const router = useRouter();
const isLoading = ref(false);
const showSuccessModal = ref(false);

const signupData = reactive({
    fullname: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    imageLink: ''
});

const passwordStatusDisplay = ref("none");
const confirmPasswordStatusDisplay = ref("none");
const imagePreview = ref(null);
const agreedToTerms = ref(false);

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            signupData.imageLink = e.target.result;
            imagePreview.value = e.target.result;
        };
        reader.readAsDataURL(file);
    }
};

const passwordCheck = () => {
    if (signupData.password.length < 8) {
        passwordStatusDisplay.value = "block"
    } else {
        passwordStatusDisplay.value = "none"
    }
    if (signupData.confirmPassword) checkConfirmPassword();
}

const checkConfirmPassword = () => {
    if (signupData.confirmPassword !== signupData.password) {
        confirmPasswordStatusDisplay.value = "block";
    } else {
        confirmPasswordStatusDisplay.value = "none";
    }
}

const handleRegister = async () => {
    if (signupData.password !== signupData.confirmPassword || signupData.password.length < 8) {
        passwordCheck();
        checkConfirmPassword();
        return;
    }

    if (!agreedToTerms.value) {
        return;
    }

    isLoading.value = true;
    try {
        await store.dispatch('auth/getRegisterData', signupData);
        showSuccessModal.value = true;
    } catch (error) {
        console.error(error);
        alert("Registration failed. Please try again.");
    } finally {
        isLoading.value = false;
    }
};

const closeAndRedirect = () => {
    showSuccessModal.value = false;
    router.push('/');
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
        <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-slate-900">Sign Up</h2>
                <p class="text-slate-500 text-sm mt-2">Enter your details below</p>
            </div>

            <form @submit.prevent="handleRegister">
                <div class="mb-6 text-center">
                    <div class="flex flex-col items-center">
                        <div
                            class="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200 mb-3 bg-slate-100 flex items-center justify-center relative">
                            <img v-if="imagePreview" :src="imagePreview" class="w-full h-full object-cover">
                            <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-slate-400">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                        </div>
                        <label
                            class="cursor-pointer bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition">
                            <span>Upload Photo</span>
                            <input type="file" accept="image/*" class="hidden" @change="handleImageUpload">
                        </label>
                    </div>
                </div>
                <BaseInput v-model="signupData.fullname" label="Full Name" placeholder="Enter your full name"
                    required />
                <BaseInput v-model="signupData.username" label="Username" placeholder="Choose a username" required />
                <BaseInput v-model="signupData.email" label="Email Address" placeholder="you@example.com" type="email"
                    required />
                <BaseInput v-model="signupData.password" label="Password" placeholder="********" type="password"
                    @keyInput="passwordCheck" required />
                <p class="text-red-500 text-sm mb-4" style="font-size: 11px;"
                    :style="{ display: passwordStatusDisplay }">The password field must be at least 8 characters</p>
                <BaseInput v-model="signupData.confirmPassword" label="Confirm Password" placeholder="********"
                    type="password" required />
                <p class="text-red-500 text-xs mt-1 mb-3" :style="{ display: confirmPasswordStatusDisplay }">
                    The password confirmation does not match
                </p>
                <div class="flex items-start mb-4 mt-4">
                    <div class="flex items-center h-5">
                        <input id="terms" type="checkbox" v-model="agreedToTerms"
                            class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-teal-300 accent-teal-700 cursor-pointer"
                            required>
                    </div>
                    <label for="terms" class="ml-2 text-sm font-medium text-gray-500 cursor-pointer select-none">
                        By clicking sign up, I hereby agree and consent to <a href="#" class="text-[#178A8D] hover:underline">Term & Conditions;</a> Term I confirm that I have read
                        <a href="#" class="text-[#178A8D] hover:underline">Privacy Policy.</a>
                    </label>
                </div>
                <BaseButton type="submit"
                    class="w-full bg-[#178A8D] text-white py-3 rounded-lg font-semibold hover:bg-teal-800 transition mt-2">
                    {{ isLoading ? 'Registering...' : 'Sign Up' }}
                </BaseButton>
            </form>

            <div class="mt-6 text-center text-sm text-slate-600">
                Already have an account?
                <router-link to="/login" class="text-[#178A8D] font-bold hover:underline">Login here</router-link>
            </div>
        </div>

        <base-modal :isOpen="showSuccessModal" @close="closeAndRedirect">
            <div class="w-full flex flex-col justify-center items-center text-center px-4 py-2">
                <img src="@/assets/images/paperplane.png" alt="Success" class="w-40 mb-6">
                <h1 class="text-2xl font-bold text-slate-900 mb-2">Successfully Register!</h1>
                <p class="text-slate-500 mb-6">
                    Thank you for register at vintage. Start find your favorite pre-loved product here.
                </p>
                <router-link to="/" class="block w-full" @click="showSuccessModal = false">
                    <base-button
                        class="w-full bg-teal-700 text-white hover:bg-teal-800 py-3 rounded-lg font-medium transition shadow-sm">
                        Go to Homepage
                    </base-button>
                </router-link>
            </div>
        </base-modal>

    </div>
</template>