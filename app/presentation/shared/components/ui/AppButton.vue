<template>
  <button
    :type="type"
    :class="buttonClass"
    :disabled="isDisabled"
    @click="$emit('click', $event)"
  >
    <span
      v-if="loading && !icon"
      class="material-symbols-outlined animate-spin text-[18px]"
    >
      progress_activity
    </span>
    <span
      v-if="icon && iconPosition === 'left'"
      class="material-symbols-outlined text-[20px]"
    >
      {{ icon }}
    </span>
    <slot />
    <span
      v-if="icon && iconPosition === 'right'"
      class="material-symbols-outlined text-[20px]"
    >
      {{ icon }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'
type ButtonType = 'button' | 'submit' | 'reset'

interface AppButtonProps {
  type?: ButtonType
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: string
  iconPosition?: 'left' | 'right'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
}

defineOptions({
  name: 'AppButton',
})

const props = withDefaults(defineProps<AppButtonProps>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  icon: '',
  iconPosition: 'right',
  loading: false,
  disabled: false,
  fullWidth: false,
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const sizeClassByVariant: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-xs rounded-lg',
  md: 'px-4 py-2.5 text-sm rounded-lg',
  lg: 'px-5 py-3 text-sm rounded-xl',
}

const styleClassByVariant: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-container',
  secondary: 'bg-surface-container-low/10 text-white hover:bg-surface-container-low/20',
  ghost: 'bg-transparent border border-outline/30 text-outline-variant hover:text-white hover:bg-surface-container-low/10',
  danger: 'bg-status-error text-white hover:opacity-90',
}

const isDisabled = computed(() => props.disabled || props.loading)

const buttonClass = computed(() => {
  const widthClass = props.fullWidth ? 'w-full' : ''
  const disabledClass = isDisabled.value ? 'opacity-70 cursor-not-allowed' : 'active:scale-[0.98]'

  return [
    'font-semibold inline-flex items-center justify-center gap-2 transition-all shadow-sm',
    widthClass,
    sizeClassByVariant[props.size],
    styleClassByVariant[props.variant],
    disabledClass,
  ]
})
</script>
