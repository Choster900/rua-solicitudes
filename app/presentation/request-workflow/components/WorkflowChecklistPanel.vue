<template>
  <article class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 p-4">
    <div class="flex items-center justify-between gap-3">
      <h3 class="text-sm font-semibold text-white">
        Checklist de validación
      </h3>
      <span
        class="rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em]"
        :class="completedClass"
      >
        {{ isComplete ? 'Completo' : 'Pendiente' }}
      </span>
    </div>

    <div class="mt-3 space-y-2.5">
      <AppCheckbox
        v-for="entry in checklistEntries"
        :key="entry.key"
        v-model="localChecklist[entry.key]"
        :disabled="disabled"
        :label="entry.label"
      />
    </div>

    <p
      v-if="error"
      class="mt-2 text-xs text-status-error"
    >
      {{ error }}
    </p>
  </article>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import AppCheckbox from '~/presentation/shared/components/ui/AppCheckbox.vue'
import type { WorkflowChecklistState } from '~/presentation/request-workflow/interfaces/workflow-request.interface'

interface WorkflowChecklistPanelProps {
  checklist: WorkflowChecklistState
  labels: Record<keyof WorkflowChecklistState, string>
  disabled?: boolean
  error?: string
}

defineOptions({
  name: 'WorkflowChecklistPanel',
})

const props = withDefaults(defineProps<WorkflowChecklistPanelProps>(), {
  disabled: false,
  error: '',
})

const emit = defineEmits<{
  'update:checklist': [value: WorkflowChecklistState]
}>()

const localChecklist = reactive<WorkflowChecklistState>({
  briefValidated: false,
  technicalSpecsValidated: false,
  assetsValidated: false,
  legalValidated: false,
})

watch(
  () => props.checklist,
  (nextChecklist) => {
    Object.assign(localChecklist, nextChecklist)
  },
  { immediate: true, deep: true },
)

watch(
  localChecklist,
  (nextChecklist) => {
    emit('update:checklist', {
      ...nextChecklist,
    })
  },
  { deep: true },
)

const checklistEntries = computed(() => {
  return Object.entries(props.labels).map(([key, label]) => ({
    key: key as keyof WorkflowChecklistState,
    label,
  }))
})

const isComplete = computed(() => Object.values(localChecklist).every(Boolean))
const completedClass = computed(() => {
  return isComplete.value
    ? 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200'
    : 'border-amber-400/40 bg-amber-500/15 text-amber-200'
})
</script>
