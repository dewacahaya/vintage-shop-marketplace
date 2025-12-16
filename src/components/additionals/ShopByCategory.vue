<script setup>
import { reactive, watch } from 'vue'
import BaseCheckbox from '../ui/BaseCheckbox.vue'

const categories = [
    'Jackets',
    'T-Shirts',
    'Shirts',
    'Shoes',
    'Accessories',
    'Hoodies',
    'Pants',
    'Dress'
]

const selected = reactive({})

categories.forEach(c => (selected[c] = false))

const emit = defineEmits(['change'])

watch(
    selected,
    () => {
        const active = Object.keys(selected).filter(c => selected[c])
        emit('change', active)
    },
    { deep: true }
)
</script>

<template>
    <div class="mb-8">
        <h2 class="text-xl font-semibold mb-4 text-slate-900">Shop by Category</h2>

        <div class="flex flex-wrap gap-3">
            <BaseCheckbox v-for="category in categories" :key="category" v-model="selected[category]"
                :label="category" />
        </div>
    </div>
</template>