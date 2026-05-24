<script setup lang="ts">
import { computed, ref } from 'vue'
import { useDropdownMenu } from '~/presentation/shared/composables/useDropdownMenu'

type SelectValue = string | number

export interface AppSelectOption {
  label: string
  value: SelectValue
  description?: string
  disabled?: boolean
}

interface AppSelectProps {
  modelValue?: SelectValue | SelectValue[] | null
  options: AppSelectOption[]
  icon?: string
  placeholder?: string
  searchPlaceholder?: string
  noResultsText?: string
  searchable?: boolean
  multiple?: boolean
  disabled?: boolean
  clearable?: boolean
  maxVisibleTags?: number
  inputClass?: string
  dropdownDirection?: 'down' | 'up'
}

defineOptions({
  name: 'AppSelect',
})

const props = withDefaults(defineProps<AppSelectProps>(), {
  modelValue: null,
  icon: '',
  placeholder: 'Seleccionar opción',
  searchPlaceholder: 'Buscar opción...',
  noResultsText: 'No se encontraron resultados',
  searchable: true,
  multiple: false,
  disabled: false,
  clearable: true,
  maxVisibleTags: 2,
  inputClass: '',
  dropdownDirection: 'down',
})

const emit = defineEmits<{
  'update:modelValue': [value: SelectValue | SelectValue[] | null]
  'blur': []
}>()

const searchTerm = ref('')
const rootRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)

const { isOpen, close: closeDropdown } = useDropdownMenu({
  rootRef,
  outsideClickEvent: 'mousedown',
  onClose: () => {
    searchTerm.value = ''
    emit('blur')
  },
})

const selectedValues = computed<SelectValue[]>(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) ? props.modelValue : []
  }

  if (props.modelValue === null || props.modelValue === undefined || Array.isArray(props.modelValue)) {
    return []
  }

  return [props.modelValue]
})

const selectedOptions = computed(() => props.options.filter(option => selectedValues.value.includes(option.value)))

const filteredOptions = computed(() => {
  if (!props.searchable || !searchTerm.value.trim()) {
    return props.options
  }

  const query = searchTerm.value.trim().toLowerCase()

  return props.options.filter((option) => {
    const searchableText = [option.label, option.description ?? ''].join(' ').toLowerCase()

    return searchableText.includes(query)
  })
})

const visibleTags = computed(() => selectedOptions.value.slice(0, props.maxVisibleTags))
const hiddenTagsCount = computed(() => Math.max(0, selectedOptions.value.length - visibleTags.value.length))
const canClear = computed(() => props.clearable && !props.disabled && selectedValues.value.length > 0)
const dropdownPositionClass = computed(() => (props.dropdownDirection === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'))

const isSelected = (value: SelectValue) => selectedValues.value.includes(value)

const openMenu = () => {
  if (props.disabled) {
    return
  }

  isOpen.value = true
  if (props.searchable) {
    setTimeout(() => {
      searchInputRef.value?.focus()
    }, 0)
  }
}

const closeMenu = () => {
  closeDropdown()
}

const toggleMenu = () => {
  if (isOpen.value) {
    closeMenu()
    return
  }

  openMenu()
}

const selectOption = (option: AppSelectOption) => {
  if (option.disabled) {
    return
  }

  if (props.multiple) {
    const currentValues = [...selectedValues.value]
    const index = currentValues.indexOf(option.value)

    if (index >= 0) {
      currentValues.splice(index, 1)
    }
    else {
      currentValues.push(option.value)
    }

    emit('update:modelValue', currentValues)
    return
  }

  emit('update:modelValue', option.value)
  closeMenu()
}

const clearSelection = () => {
  if (props.multiple) {
    emit('update:modelValue', [])
  }
  else {
    emit('update:modelValue', null)
  }
}
</script>

<template>
  <div
    ref="rootRef"
    class="relative"
  >
    <button
      type="button"
      class="w-full rounded-lg border border-outline/30 bg-surface-container-lowest/5 px-3 py-2.5 text-left text-sm text-white transition-colors focus:outline-none focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-70"
      :class="[isOpen ? 'border-primary' : 'hover:border-primary/40', props.inputClass]"
      :disabled="disabled"
      @click="toggleMenu"
    >
      <div class="flex min-h-6.5 items-center justify-between gap-2">
        <div class="min-w-0 flex flex-1 items-center gap-2">
          <span
            v-if="icon"
            class="material-symbols-outlined shrink-0 text-[20px] text-outline-variant"
          >
            {{ icon }}
          </span>

          <div class="min-w-0 flex-1">
            <div
              v-if="multiple && selectedOptions.length > 0"
              class="flex flex-wrap items-center gap-1.5"
            >
              <span
                v-for="option in visibleTags"
                :key="`tag-${option.value}`"
                class="inline-flex items-center rounded-full border border-outline/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary-fixed-dim"
              >
                {{ option.label }}
              </span>
              <span
                v-if="hiddenTagsCount > 0"
                class="inline-flex items-center rounded-full border border-outline/30 bg-surface-container-low/50 px-2.5 py-0.5 text-xs font-semibold text-outline-variant"
              >
                +{{ hiddenTagsCount }}
              </span>
            </div>

            <span
              v-else-if="!multiple && selectedOptions.length > 0"
              class="block truncate font-medium text-white"
            >
              {{ selectedOptions[0]?.label }}
            </span>

            <span
              v-else
              class="block truncate text-outline-variant"
            >
              {{ placeholder }}
            </span>
          </div>
        </div>

        <div class="flex shrink-0 items-center gap-1">
          <span
            v-if="canClear"
            class="inline-flex h-7 w-7 items-center justify-center rounded-full text-outline-variant transition-colors hover:bg-surface-container-low/60 hover:text-white"
            role="button"
            tabindex="0"
            aria-label="Limpiar selección"
            @click.stop="clearSelection"
            @keydown.enter.prevent="clearSelection"
            @keydown.space.prevent="clearSelection"
          >
            <span class="material-symbols-outlined text-[18px]">close</span>
          </span>
          <span
            class="material-symbols-outlined text-[20px] text-outline-variant transition-transform"
            :class="isOpen ? 'rotate-180' : ''"
          >
            expand_more
          </span>
        </div>
      </div>
    </button>

    <div
      v-if="isOpen"
      class="absolute z-40 w-full overflow-hidden rounded-xl border border-outline/30 bg-deep-navy shadow-[0_20px_32px_-22px_rgba(2,8,23,0.82)]"
      :class="dropdownPositionClass"
      @click.stop
    >
      <div
        v-if="searchable"
        class="border-b border-outline/20 p-2.5"
      >
        <div class="relative">
          <span class="material-symbols-outlined pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-outline-variant">
            search
          </span>
          <input
            ref="searchInputRef"
            v-model="searchTerm"
            type="text"
            :placeholder="searchPlaceholder"
            class="w-full rounded-lg border border-outline/30 bg-surface-container-lowest/5 py-2.5 pl-9 pr-3 text-sm text-white outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
        </div>
      </div>

      <div class="max-h-64 overflow-auto p-1.5">
        <button
          v-for="option in filteredOptions"
          :key="`option-${option.value}`"
          type="button"
          class="group flex w-full items-start justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors"
          :class="
            option.disabled
              ? 'cursor-not-allowed opacity-50'
              : isSelected(option.value)
                ? 'bg-primary/15 text-primary'
                : 'hover:bg-surface-container-low/40'
          "
          :disabled="option.disabled"
          @click="selectOption(option)"
        >
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold">
              {{ option.label }}
            </p>
            <p
              v-if="option.description"
              class="mt-0.5 text-xs text-outline-variant"
            >
              {{ option.description }}
            </p>
          </div>

          <span
            class="material-symbols-outlined mt-0.5 shrink-0 text-[18px] transition-opacity"
            :class="isSelected(option.value) ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'"
          >
            check
          </span>
        </button>

        <p
          v-if="filteredOptions.length === 0"
          class="px-3 py-6 text-center text-sm font-medium text-outline-variant"
        >
          {{ noResultsText }}
        </p>
      </div>
    </div>
  </div>
</template>
