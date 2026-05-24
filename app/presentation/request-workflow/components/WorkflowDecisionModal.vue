<template>
  <div
    v-if="open"
    class="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 px-4"
    @click.self="handleClose"
  >
    <section class="w-full max-w-lg rounded-2xl border border-outline/20 bg-deep-navy p-5 shadow-2xl">
      <header class="flex items-start justify-between gap-4">
        <div>
          <h3 class="text-base font-semibold text-white">
            {{ title }}
          </h3>
          <p class="mt-1 text-sm text-outline-variant">
            {{ description }}
          </p>
        </div>

        <button
          type="button"
          class="inline-flex h-8 w-8 items-center justify-center rounded-full text-outline-variant transition-colors hover:bg-surface-container-low/10 hover:text-white"
          title="Cerrar"
          @click="handleClose"
        >
          <span class="material-symbols-outlined text-[18px]">close</span>
        </button>
      </header>

      <div class="mt-4 space-y-2">
        <label class="text-[0.65rem] font-label-caps uppercase text-secondary-container">
          Comentario
          <span
            v-if="requireComment"
            class="text-status-error"
          >*</span>
        </label>

        <textarea
          v-model="comment"
          rows="4"
          class="w-full resize-y rounded-lg border border-outline/30 bg-surface-container-lowest/5 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/25"
        />

        <p
          v-if="errorMessage"
          class="text-xs text-status-error"
        >
          {{ errorMessage }}
        </p>
      </div>

      <footer class="mt-5 flex flex-wrap items-center justify-end gap-2">
        <AppButton
          variant="ghost"
          @click="handleClose"
        >
          Cancelar
        </AppButton>
        <AppButton
          :variant="confirmTone === 'danger' ? 'danger' : 'primary'"
          @click="handleConfirm"
        >
          {{ confirmLabel }}
        </AppButton>
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import AppButton from '~/presentation/shared/components/ui/AppButton.vue'

interface WorkflowDecisionModalProps {
  open: boolean
  title: string
  description: string
  confirmLabel: string
  requireComment?: boolean
  confirmTone?: 'primary' | 'danger'
}

defineOptions({
  name: 'WorkflowDecisionModal',
})

const props = withDefaults(defineProps<WorkflowDecisionModalProps>(), {
  requireComment: false,
  confirmTone: 'primary',
})

const emit = defineEmits<{
  close: []
  confirm: [comment: string]
}>()

const comment = ref('')
const errorMessage = ref('')

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      comment.value = ''
      errorMessage.value = ''
    }
  },
)

const handleClose = () => {
  emit('close')
}

const handleConfirm = () => {
  if (props.requireComment && !comment.value.trim()) {
    errorMessage.value = 'Este campo es obligatorio para continuar.'
    return
  }

  emit('confirm', comment.value.trim())
}
</script>
