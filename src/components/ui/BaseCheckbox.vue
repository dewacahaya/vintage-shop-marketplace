<script setup>
defineProps({
    modelValue: Boolean,
    label: String
})

defineEmits(['update:modelValue'])
</script>

<template>
    <label class="flex items-center gap-2 px-4 py-2 border rounded-full cursor-pointer
                transition select-none" :class="modelValue
                ? 'bg-teal-700 text-white border-teal-700'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'">
        <input type="checkbox" class="hidden" :checked="modelValue" @change="$emit('update:modelValue', !modelValue)" />
        {{ label }}
    </label>
</template>


<style scoped></style>