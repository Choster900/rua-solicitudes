<template>
  <AppShellLayout screen-title="Usuarios">
    <section class="mx-auto w-full max-w-5xl space-y-4">
      <button
        class="inline-flex items-center gap-1 rounded-lg border border-outline/30 px-3 py-2 text-sm text-outline-variant transition-colors hover:bg-surface-container-low/10 hover:text-white"
        type="button"
        @click="requestCancelConfirmation"
      >
        <span class="material-symbols-outlined text-[18px]">arrow_back</span>
        Volver a usuarios
      </button>

      <UserFormCard
        mode="create"
        :model="userFormModel"
        :resolve-employee-code="generateNextEmployeeCode"
        @cancel="requestCancelConfirmation"
        @submit="requestCreateConfirmation"
      />
    </section>

    <Teleport to="body">
      <div
        v-if="confirmationDialog"
        class="fixed inset-0 z-[93] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-[2px]"
        @click.self="closeConfirmationDialog"
      >
        <section class="w-full max-w-md rounded-2xl border border-outline/30 bg-deep-navy p-5 shadow-2xl">
          <div class="flex items-start justify-between gap-3">
            <h3 class="text-lg font-headline-md font-black text-white">
              {{ confirmationDialog.title }}
            </h3>
            <button
              class="inline-flex h-8 w-8 items-center justify-center rounded-full text-outline-variant transition-colors hover:bg-surface-container-low/20 hover:text-white"
              type="button"
              title="Cerrar"
              @click="closeConfirmationDialog"
            >
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <p class="mt-2 text-sm text-outline-variant">
            {{ confirmationDialog.message }}
          </p>

          <div class="mt-5 flex justify-end gap-2">
            <AppButton
              variant="ghost"
              @click="closeConfirmationDialog"
            >
              No
            </AppButton>
            <AppButton
              :icon="confirmationDialog.confirmIcon"
              :variant="confirmationDialog.confirmVariant"
              @click="confirmDialogAction"
            >
              Sí
            </AppButton>
          </div>
        </section>
      </div>
    </Teleport>
  </AppShellLayout>
</template>

<script setup lang="ts">
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'
import AppButton from '~/presentation/shared/components/ui/AppButton.vue'
import UserFormCard from '~/presentation/users/components/UserFormCard.vue'
import { useUsersModule } from '~/presentation/users/composables/useUsersModule'
import type { UserFormModel } from '~/presentation/interfaces/users/user-form.interface'

defineOptions({
  name: 'UsuarioCreateView',
})

const router = useRouter()
const { createEmptyUserFormModel, createUser, generateNextEmployeeCode } = useUsersModule()
const userFormModel = createEmptyUserFormModel(generateNextEmployeeCode(''))

type DialogActionType = 'cancel' | 'create'
type DialogConfirmVariant = 'primary' | 'danger'

interface ConfirmationDialogState {
  actionType: DialogActionType
  title: string
  message: string
  confirmIcon: string
  confirmVariant: DialogConfirmVariant
  payload?: UserFormModel
}

const confirmationDialog = ref<ConfirmationDialogState | null>(null)

const goBackToUsers = () => {
  void router.push('/usuarios')
}

const requestCancelConfirmation = () => {
  confirmationDialog.value = {
    actionType: 'cancel',
    title: 'Cancelar creación',
    message: '¿Está seguro de cancelar? Se perderán los cambios no guardados.',
    confirmIcon: 'undo',
    confirmVariant: 'danger',
  }
}

const requestCreateConfirmation = (formModel: UserFormModel) => {
  confirmationDialog.value = {
    actionType: 'create',
    title: 'Confirmar creación',
    message: '¿Está seguro de crear el usuario con la información ingresada?',
    confirmIcon: 'save',
    confirmVariant: 'primary',
    payload: { ...formModel },
  }
}

const closeConfirmationDialog = () => {
  confirmationDialog.value = null
}

const confirmDialogAction = async () => {
  if (!confirmationDialog.value) {
    return
  }

  if (confirmationDialog.value.actionType === 'cancel') {
    closeConfirmationDialog()
    goBackToUsers()
    return
  }

  if (confirmationDialog.value.actionType === 'create' && confirmationDialog.value.payload) {
    const created = await createUser(confirmationDialog.value.payload)

    if (created) {
      closeConfirmationDialog()
      goBackToUsers()
    }
  }
}

watch(confirmationDialog, (dialogState) => {
  if (!import.meta.client) {
    return
  }

  document.body.classList.toggle('overflow-hidden', Boolean(dialogState))
})

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || !confirmationDialog.value) {
    return
  }

  closeConfirmationDialog()
}

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  document.body.classList.remove('overflow-hidden')
})

useHead(() => ({
  title: 'RUASA ERP - Nuevo Usuario',
  htmlAttrs: {
    lang: 'es',
  },
  bodyAttrs: {
    class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant',
  },
}))
</script>
