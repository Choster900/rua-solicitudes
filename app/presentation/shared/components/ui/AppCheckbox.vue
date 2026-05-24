<template>
  <label
    :for="fieldId"
    class="inline-flex items-center gap-2 cursor-pointer group"
  >
    <input
      :id="fieldId"
      :checked="modelValue"
      :name="name"
      :disabled="disabled"
      type="checkbox"
      class="h-4 w-4 rounded border-outline/30 bg-transparent text-primary focus:ring-primary transition-all"
      @change="onChange"
    >
    <span class="text-[0.8rem] text-outline-variant transition-colors group-hover:text-white">
      {{ label }}
    </span>
  </label>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface AppCheckboxProps {
  id?: string
  name?: string
  label: string
  modelValue: boolean
  disabled?: boolean
}

defineOptions({
  name: 'AppCheckbox',
})

const props = withDefaults(defineProps<AppCheckboxProps>(), {
  id: '',
  name: '',
  disabled: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const localId = ref(`check-${Math.random().toString(36).slice(2, 9)}`)
const fieldId = computed(() => props.id || localId.value)

const onChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.checked)
}
</script>
