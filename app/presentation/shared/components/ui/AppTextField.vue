<template>
  <div class="space-y-1.5">
    <label
      v-if="label"
      :for="fieldId"
      class="block text-[0.65rem] font-label-caps uppercase text-secondary-container"
    >
      {{ label }}
      <span
        v-if="required"
        class="text-status-error"
      >
        *
      </span>
    </label>

    <div class="relative">
      <span
        v-if="icon"
        class="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]"
      >
        {{ icon }}
      </span>
      <input
        :id="fieldId"
        :name="name"
        :type="inputType"
        :placeholder="placeholder"
        :autocomplete="autocomplete"
        :required="required"
        :disabled="disabled"
        :value="modelValue"
        class="w-full bg-surface-container-lowest/5 border border-outline/30 rounded-lg py-2.5 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
        :class="[icon ? 'pl-10 pr-10' : 'px-3', error ? 'border-status-error focus:border-status-error focus:ring-status-error/50' : '']"
        @input="onInput"
        @blur="$emit('blur')"
      >
      <button
        v-if="isPasswordField"
        class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-outline transition-colors hover:bg-surface-container-low/10 hover:text-white"
        type="button"
        :title="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
        @click="toggleShowPassword"
      >
        <span class="material-symbols-outlined text-[20px]">
          {{ showPassword ? 'visibility_off' : 'visibility' }}
        </span>
      </button>
    </div>

    <p
      v-if="error"
      class="text-xs text-status-error"
    >
      {{ error }}
    </p>
    <p
      v-else-if="hint"
      class="text-xs text-outline-variant"
    >
      {{ hint }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface AppTextFieldProps {
  id?: string
  name?: string
  modelValue: string
  label?: string
  placeholder?: string
  autocomplete?: string
  type?: 'text' | 'email' | 'password'
  icon?: string
  required?: boolean
  disabled?: boolean
  error?: string
  hint?: string
}

defineOptions({
  name: 'AppTextField',
})

const props = withDefaults(defineProps<AppTextFieldProps>(), {
  id: '',
  name: '',
  label: '',
  placeholder: '',
  autocomplete: 'off',
  type: 'text',
  icon: '',
  required: false,
  disabled: false,
  error: '',
  hint: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'blur': []
}>()

const localId = ref(`field-${Math.random().toString(36).slice(2, 9)}`)
const showPassword = ref(false)

const fieldId = computed(() => props.id || localId.value)
const isPasswordField = computed(() => props.type === 'password')
const inputType = computed(() => {
  if (!isPasswordField.value) {
    return props.type
  }

  return showPassword.value ? 'text' : 'password'
})

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const toggleShowPassword = () => {
  showPassword.value = !showPassword.value
}
</script>
