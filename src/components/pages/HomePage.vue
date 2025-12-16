<script setup>
import { computed, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import HeroSection from '../sections/HeroSection.vue';
import NewProductSection from '../sections/NewProductSection.vue';
import PopularSection from '../sections/PopularSection.vue';

const store = useStore();
const dataReady = ref(false);
const allProducts = ref([]);

onMounted(async () => {
  try {
    await store.dispatch('product/fetchProductData');
    allProducts.value = store.getters['product/getProducts'];
    dataReady.value = true;
  } catch (error) {
    console.log(error);
  }
});

const popularItems = computed(() => {
  return allProducts.value.slice(0, 4);
});

const newArrivalItems = computed(() => {
  return [...allProducts.value].reverse().slice(0, 4);
});
</script>

<template>
  <HeroSection />

  <div v-if="dataReady">
    <PopularSection :items="popularItems" />
    <NewProductSection :items="newArrivalItems" />
  </div>

  <div v-else class="text-center py-20">
    <p class="text-gray-500">Loading products...</p>
  </div>
</template>