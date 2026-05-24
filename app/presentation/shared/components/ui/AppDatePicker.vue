<script setup lang="ts">
import { computed } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import { useDatePickerLocale } from '~/presentation/shared/composables/useDatePickerLocale'
import { useThemeMode } from '~/presentation/shared/composables/useThemeMode'

interface AppDatePickerProps {
  modelValue?: string
  name?: string
  min?: string
  max?: string
  disabled?: boolean
  required?: boolean
  readonly?: boolean
  showTime?: boolean
  withLeadingIcon?: boolean
  ariaLabel?: string
  inputClass?: string
  placeholder?: string
  clearable?: boolean
}

defineOptions({
  name: 'AppDatePicker',
})

const props = withDefaults(defineProps<AppDatePickerProps>(), {
  modelValue: '',
  name: '',
  min: '',
  max: '',
  disabled: false,
  required: false,
  readonly: false,
  showTime: false,
  withLeadingIcon: false,
  ariaLabel: 'Seleccionar fecha',
  inputClass: '',
  placeholder: 'Seleccionar fecha',
  clearable: true,
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'blur': []
}>()

const { mode } = useThemeMode()
const { localeEs, weekStart, modelType, displayFormat, hideInputIconAttrs, buildInputClass } = useDatePickerLocale()
const isDarkMode = computed(() => mode.value === 'dark')

const internalModel = computed<string | null>({
  get() {
    return props.modelValue || null
  },
  set(value) {
    emit('update:modelValue', value ?? '')
  },
})

const showClearButton = computed(() => {
  return props.clearable && !props.disabled && !props.readonly && Boolean(props.modelValue)
})

const pickerInputClass = computed(() => {
  return buildInputClass(
    props.withLeadingIcon ? 'pl-10' : 'pl-3',
    [showClearButton.value ? 'pr-10' : '', props.inputClass].filter(Boolean).join(' '),
  )
})

const clearDate = () => {
  emit('update:modelValue', '')
}

const timeConfig = computed(() => ({
  enableTimePicker: props.showTime,
}))
</script>

<template>
  <div class="relative">
    <VueDatePicker
      v-model="internalModel"
      :auto-apply="true"
      class="app-date-picker"
      :class="{ 'has-leading-icon': withLeadingIcon }"
      :clearable="false"
      :dark="isDarkMode"
      :disabled="disabled"
      :format="displayFormat"
      :input-attrs="hideInputIconAttrs"
      :input-class-name="pickerInputClass"
      :locale="localeEs"
      :max-date="max || undefined"
      :min-date="min || undefined"
      :model-type="modelType"
      :name="name"
      :placeholder="placeholder"
      :readonly="readonly"
      :required="required"
      :teleport="false"
      :time-config="timeConfig"
      :week-start="weekStart"
      @closed="$emit('blur')"
    />
    <span
      v-if="withLeadingIcon"
      class="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-[20px] text-outline-variant"
      :aria-label="ariaLabel"
    >
      calendar_today
    </span>

    <button
      v-if="showClearButton"
      aria-label="Limpiar fecha"
      class="absolute right-2 top-1/2 z-10 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-outline-variant transition-colors hover:bg-surface-container-low/70 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
      type="button"
      @click.stop="clearDate"
      @mousedown.prevent
    >
      <span class="material-symbols-outlined text-[16px]">close</span>
    </button>
  </div>
</template>

<style scoped>
.app-date-picker :deep(.dp__theme_dark) {
  --dp-background-color: #0b1120;
  --dp-text-color: #e2ebfa;
  --dp-hover-color: rgba(67, 88, 122, 0.55);
  --dp-hover-text-color: #f8fbff;
  --dp-hover-icon-color: #d8e6ff;
  --dp-primary-color: #005696;
  --dp-primary-disabled-color: #3e78ae;
  --dp-primary-text-color: #ffffff;
  --dp-secondary-color: #a2b0c6;
  --dp-border-color: rgba(114, 119, 129, 0.45);
  --dp-menu-border-color: rgba(114, 119, 129, 0.42);
  --dp-border-color-hover: #5f87b1;
  --dp-border-color-focus: #6ea2d8;
  --dp-disabled-color: rgba(49, 61, 78, 0.9);
  --dp-disabled-color-text: #8ea0bb;
  --dp-scroll-bar-background: #0b1120;
  --dp-scroll-bar-color: #4f607b;
  --dp-success-color: #0f8a45;
  --dp-success-color-disabled: #33705a;
  --dp-icon-color: #9fb2cd;
  --dp-danger-color: #ef4444;
  --dp-marker-color: #ef4444;
  --dp-tooltip-color: #1a2537;
  --dp-highlight-color: rgba(0, 86, 150, 0.26);
  --dp-range-between-dates-background-color: rgba(57, 82, 112, 0.55);
  --dp-range-between-dates-text-color: #eaf2ff;
  --dp-range-between-border-color: rgba(57, 82, 112, 0.55);
}

.app-date-picker :deep(.dp__theme_light) {
  --dp-background-color: #f8f9ff;
  --dp-text-color: #0b1c30;
  --dp-hover-color: rgba(211, 228, 254, 0.7);
  --dp-hover-text-color: #0b1c30;
  --dp-hover-icon-color: #4f5b69;
  --dp-primary-color: #005696;
  --dp-primary-disabled-color: #6b9ec9;
  --dp-primary-text-color: #ffffff;
  --dp-secondary-color: #5f6670;
  --dp-border-color: rgba(114, 119, 129, 0.35);
  --dp-menu-border-color: rgba(114, 119, 129, 0.3);
  --dp-border-color-hover: #5f87b1;
  --dp-border-color-focus: #4f83ba;
  --dp-disabled-color: #edf3ff;
  --dp-disabled-color-text: #7f8a99;
  --dp-scroll-bar-background: #edf3ff;
  --dp-scroll-bar-color: #9aabc2;
  --dp-success-color: #0f8a45;
  --dp-success-color-disabled: #6ea78c;
  --dp-icon-color: #4f5b69;
  --dp-danger-color: #dc2626;
  --dp-marker-color: #dc2626;
  --dp-tooltip-color: #ffffff;
  --dp-highlight-color: rgba(0, 86, 150, 0.14);
  --dp-range-between-dates-background-color: rgba(211, 228, 254, 0.8);
  --dp-range-between-dates-text-color: #0b1c30;
  --dp-range-between-border-color: rgba(211, 228, 254, 0.8);
}

:global(html.dark) .app-date-picker :deep(.dp__input) {
  background-color: rgba(15, 23, 42, 0.65) !important;
  color: #e2ebfa !important;
  border-color: rgba(114, 119, 129, 0.45) !important;
}

:global(html.dark) .app-date-picker :deep(.dp__input)::placeholder {
  color: #90a2bd !important;
}

:global(html.dark) .app-date-picker :deep(.dp__input:focus),
:global(html.dark) .app-date-picker :deep(.dp__input_focus) {
  border-color: #6ea2d8 !important;
  box-shadow: 0 0 0 2px rgba(0, 86, 150, 0.25) !important;
}

:global(html.light) .app-date-picker :deep(.dp__input) {
  background-color: #f8f9ff !important;
  color: #0b1c30 !important;
  border-color: rgba(114, 119, 129, 0.35) !important;
}

:global(html.light) .app-date-picker :deep(.dp__input)::placeholder {
  color: #5f6670 !important;
}

:global(html.light) .app-date-picker :deep(.dp__input:focus),
:global(html.light) .app-date-picker :deep(.dp__input_focus) {
  border-color: #4f83ba !important;
  box-shadow: 0 0 0 2px rgba(0, 86, 150, 0.18) !important;
}

.app-date-picker :deep(.dp__menu),
.app-date-picker :deep(.dp__input_wrap),
.app-date-picker :deep(.dp__input),
.app-date-picker :deep(.dp__action_row) {
  font-family: var(--app-font-sans);
}

.app-date-picker.has-leading-icon :deep(.dp__input) {
  padding-left: 2.5rem !important;
}

.app-date-picker :deep(.dp__input_icon),
.app-date-picker :deep(.dp--menu-wrapper .dp__input_icon),
.app-date-picker :deep(.dp__icon) {
  display: none !important;
}

.app-date-picker :deep(.dp__menu) {
  border-radius: 14px;
  box-shadow: 0 22px 34px -26px rgba(2, 8, 23, 0.85);
}

.app-date-picker :deep(.dp__calendar_item) {
  transition: all 0.16s ease;
}
</style>
