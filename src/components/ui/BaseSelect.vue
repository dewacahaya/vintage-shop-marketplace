<script setup>
defineProps({
    data: { type: Array, require: true },
    id: { type: String, require: true },
    modelValue: { type: [String, Number] },
})
</script>

<template>
    <select class="w-full bg-transparent border border-slate-200 rounded-md pl-3 pr-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow" :id="id" @input="$emit('update:modelValue', $event.target.value)">
        <!-- <option value="" disabled selected>EN</option> -->
        <option v-for="(item, index) in data" :key="index" :value="item" :selected="modelValue === item">
            {{ item }}
        </option>
    </select>
</template>

<style scoped></style>