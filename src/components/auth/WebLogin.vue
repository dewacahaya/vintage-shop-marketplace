<script setup>
import { reactive, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import BaseButton from '../../components/ui/BaseButton.vue';
import BaseInput from '../../components/ui/BaseInput.vue';
import BaseModal from '../ui/BaseModal.vue';

const store = useStore();
const router = useRouter();
const isLoading = ref(false);

const loginData = reactive({
    email: '',
    password: ''
});

const showLoginError = ref(false);

const handleLogin = async () => {
    isLoading.value = true;
    try {
        await store.dispatch('auth/getLoginData', loginData);
        router.push('/');
    } catch (error) {
        console.error(error);
        showLoginError.value = true;
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div class="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
            <div class="mb-8">
                <h2 class="text-2xl font-bold text-slate-900">Login to Vintage</h2>
                <p class="text-slate-500 text-sm mt-2">Enter your details below</p>
            </div>
            <form @submit.prevent="handleLogin">
                <BaseInput v-model="loginData.email" label="Email Address" placeholder="you@example.com" type="email"
                    required />
                <BaseInput v-model="loginData.password" label="Password" placeholder="••••••••" type="password"
                    required />
                <BaseButton type="submit"
                    class="w-full bg-[#178A8D] text-white py-3 rounded-lg font-semibold hover:bg-teal-800 transition mt-2">
                    {{ isLoading ? 'Logging In...' : 'Login' }}
                </BaseButton>
            </form>
            <div class="mt-6 text-center text-sm text-slate-600">
                Don't have an account?
                <router-link to="/signup" class="text-[#178A8D] font-bold hover:underline">Sign Up here</router-link>
            </div>
        </div>
    </div>

    <base-modal :is-open="showLoginError" @close="showLoginError = false">
        <div class="flex flex-col items-center text-center px-4 py-2">
            <img src="@/assets/images/error.png" alt="Error Icon" class="w-24 mb-6">
            <h1 class="text-xl font-bold text-slate-900 mb-2">Login Failed!</h1>
            <p class="text-slate-500 mb-8 max-w-xs mx-auto leading-relaxed text-sm">
                Please check your email and password and try again.
            </p>
        </div>
    </base-modal>
</template>