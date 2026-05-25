<template>
  <AppShellLayout screen-title="Usuarios">
    <section class="space-y-5">
      <UsersToolbar
        :active-users="activeUsers"
        :blocked-users="blockedUsers"
        :pending-users="pendingUsers"
        :total-users="totalUsers"
        @add-user="goToCreateUser"
        @export-users="handleExportUsers"
        @import-users="triggerImport"
      />

      <UsersDataTable
        :rows="userTableRows"
        @delete-user="openDeleteDialog"
        @edit-user="goToEditUser"
        @send-temporary-access="sendTemporaryAccess"
      />

      <input
        ref="importInputRef"
        accept=".csv,.xlsx,.xls"
        class="hidden"
        type="file"
        @change="handleImportSelection"
      >
    </section>

    <Teleport to="body">
      <div
        v-if="userToDelete"
        class="fixed inset-0 z-[93] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-[2px]"
        @click.self="closeDeleteDialog"
      >
        <section class="w-full max-w-md rounded-2xl border border-outline/30 bg-deep-navy p-5 shadow-2xl">
          <div class="flex items-start justify-between gap-3">
            <h3 class="text-lg font-headline-md font-black text-white">
              Confirmar eliminación
            </h3>
            <button
              class="inline-flex h-8 w-8 items-center justify-center rounded-full text-outline-variant transition-colors hover:bg-surface-container-low/20 hover:text-white"
              type="button"
              title="Cerrar"
              @click="closeDeleteDialog"
            >
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <p class="mt-2 text-sm text-outline-variant">
            Se eliminará el usuario
            <span class="font-semibold text-white">
              {{ userToDelete.employeeCode }} - {{ userToDelete.fullName }}
            </span>.
            Esta acción no se puede deshacer.
          </p>

          <div class="mt-5 flex justify-end gap-2">
            <AppButton
              variant="ghost"
              @click="closeDeleteDialog"
            >
              Cancelar
            </AppButton>
            <AppButton
              icon="delete"
              variant="danger"
              @click="confirmDelete"
            >
              Eliminar
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
import UsersDataTable from '~/presentation/users/components/UsersDataTable.vue'
import UsersToolbar from '~/presentation/users/components/UsersToolbar.vue'
import { useUsersModule } from '~/presentation/users/composables/useUsersModule'

defineOptions({
  name: 'UsuariosView',
})

const router = useRouter()
const userToDelete = ref<{ id: string, employeeCode: string, fullName: string } | null>(null)

const {
  importInputRef,
  totalUsers,
  activeUsers,
  pendingUsers,
  blockedUsers,
  userTableRows,
  deleteUser,
  findUserById,
  sendTemporaryAccess,
  triggerImport,
  handleImportSelection,
  handleExportUsers,
} = useUsersModule()

const goToCreateUser = () => {
  void router.push('/usuarios/nuevo')
}

const goToEditUser = (userId: string) => {
  void router.push(`/usuarios/${userId}/editar`)
}

const openDeleteDialog = (userId: string) => {
  const user = findUserById(userId)

  if (!user) {
    return
  }

  userToDelete.value = {
    id: user.id,
    employeeCode: user.employeeCode,
    fullName: user.fullName,
  }
}

const closeDeleteDialog = () => {
  userToDelete.value = null
}

const confirmDelete = () => {
  if (!userToDelete.value) {
    return
  }

  deleteUser(userToDelete.value.id)
  closeDeleteDialog()
}

watch(userToDelete, (dialogUser) => {
  if (!import.meta.client) {
    return
  }

  document.body.classList.toggle('overflow-hidden', Boolean(dialogUser))
})

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key !== 'Escape' || !userToDelete.value) {
    return
  }

  closeDeleteDialog()
}

onMounted(() => {
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscapeKey)
  document.body.classList.remove('overflow-hidden')
})

useHead(() => ({
  title: 'RUASA ERP - Usuarios',
  htmlAttrs: {
    lang: 'es',
  },
  bodyAttrs: {
    class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant',
  },
}))
</script>
