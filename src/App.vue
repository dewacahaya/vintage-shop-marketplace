<script setup>
import WebFooter from './components/footer/WebFooter.vue';
import NavigationBar from './components/header/NavigationBar.vue';
import HomePage from './components/pages/HomePage.vue';
</script>

<template>
  <div>
    <NavigationBar/>
    <router-view></router-view>
    <WebFooter/>
  </div>
</template>

<style scoped></style>
