<script setup>
import BaseButton from '../ui/BaseButton.vue';
</script>

<template>
    <div class="flex items-center">
        <router-link to="/login">
            <base-button class="bg-none border border-[#178A8D] text-[#178A8D] px-4 py-2 mr-3 text-sm hover:bg-teal-50">
                Login
            </base-button>
        </router-link>
        <router-link to="/signup">
            <base-button class="bg-[#178A8D] text-white px-4 py-2 text-sm hover:bg-teal-700 shadow-md">
                Sign Up
            </base-button>
        </router-link>
    </div>
</template>