<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';

import SearchMenu from './SearchMenu.vue';
import SignupMenu from './SignupMenu.vue';
import ProfileMenu from './ProfileMenu.vue';
import BaseSelect from '../ui/BaseSelect.vue';

const store = useStore();
const route = useRoute();

const showSearch = computed(() => {
    const hideRoutes = ['login', 'signup'];
    return !hideRoutes.includes(route.name);
});

const components = {
    'signup-menu': SignupMenu,
    'profile-menu': ProfileMenu
};

const menuComponent = computed(() => {
    const isLoggedIn = !!store.state.auth.token;
    return isLoggedIn ? 'profile-menu' : 'signup-menu';
});
</script>

<template>
    <nav
        class="w-full h-20 flex items-center justify-between border-b border-[#178A8D] bg-white px-4 sm:px-8 sticky top-0 z-40">

        <div class="shrink-0">
            <router-link to="/">
                <img src="@/assets/images/Logo.png" alt="Logo" class="w-28 sm:w-32">
            </router-link>
        </div>

        <div v-if="showSearch" class="flex-1 max-w-2xl px-4 sm:px-8">
            <SearchMenu />
        </div>

        <div class="flex items-center gap-4 sm:gap-6">
            <component :is="components[menuComponent]"></component>
            <div class="pl-2 border-l border-slate-200 ml-2">
                <base-select :data="['EN', 'ID']" class="min-w-15"></base-select>
            </div>
        </div>
    </nav>
</template>