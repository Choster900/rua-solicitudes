<template>
  <article class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 p-4">
    <h3 class="text-sm font-semibold text-white">
      Observaciones
    </h3>

    <ul
      v-if="observations.length > 0"
      class="mt-3 space-y-2"
    >
      <li
        v-for="(item, index) in observations"
        :key="`${item}-${index}`"
        class="rounded-lg border border-outline/20 bg-surface-container-low/10 px-3 py-2 text-xs text-outline-variant"
      >
        {{ item }}
      </li>
    </ul>

    <p
      v-else
      class="mt-3 text-xs text-outline-variant"
    >
      Sin observaciones registradas.
    </p>
  </article>
</template>

<script setup lang="ts">
interface WorkflowObservationsPanelProps {
  observations: string[]
}

defineOptions({
  name: 'WorkflowObservationsPanel',
})

defineProps<WorkflowObservationsPanelProps>()
</script>
