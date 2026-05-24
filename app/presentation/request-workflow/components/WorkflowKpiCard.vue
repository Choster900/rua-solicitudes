<template>
  <article class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3">
    <p class="text-[11px] uppercase tracking-[0.12em] text-outline-variant">
      {{ label }}
    </p>
    <p
      class="mt-1 text-xl font-semibold"
      :class="valueClass"
    >
      {{ value }}
    </p>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface WorkflowKpiCardProps {
  label: string
  value: number
  tone?: 'default' | 'success' | 'warning' | 'danger'
}

defineOptions({
  name: 'WorkflowKpiCard',
})

const props = withDefaults(defineProps<WorkflowKpiCardProps>(), {
  tone: 'default',
})

const valueClass = computed(() => {
  if (props.tone === 'success') {
    return 'text-emerald-200'
  }

  if (props.tone === 'warning') {
    return 'text-amber-200'
  }

  if (props.tone === 'danger') {
    return 'text-rose-200'
  }

  return 'text-white'
})
</script>
