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
        @import-users="openImportDialog"
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
        @change="handleImportSelectionFromInput"
      >
    </section>

    <Teleport to="body">
      <div
        v-if="isImportDialogOpen"
        class="fixed inset-0 z-[93] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-[2px]"
        @click.self="closeImportDialog"
      >
        <section class="w-full max-w-2xl rounded-2xl border border-outline/30 bg-deep-navy p-5 shadow-2xl">
          <div class="flex items-start justify-between gap-3">
            <div>
              <h3 class="text-lg font-headline-md font-black text-white">
                Importar usuarios
              </h3>
              <p class="mt-1 text-sm text-outline-variant">
                Carga un archivo CSV/Excel para registrar usuarios de forma masiva.
              </p>
            </div>
            <button
              class="inline-flex h-8 w-8 items-center justify-center rounded-full text-outline-variant transition-colors hover:bg-surface-container-low/20 hover:text-white"
              type="button"
              title="Cerrar"
              @click="closeImportDialog"
            >
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <button
            class="mt-5 w-full rounded-2xl border border-dashed px-6 py-10 text-center transition-all"
            :class="isImportDragActive
              ? 'border-primary bg-primary/10'
              : 'border-outline/30 bg-surface-container-lowest/5 hover:border-primary/50 hover:bg-surface-container-low/10'"
            type="button"
            @click="openImportPicker"
            @dragenter.prevent="isImportDragActive = true"
            @dragover.prevent="isImportDragActive = true"
            @dragleave.prevent="isImportDragActive = false"
            @drop.prevent="handleImportDrop"
          >
            <span class="material-symbols-outlined text-[34px] text-secondary-container">upload_file</span>
            <p class="mt-3 text-base font-semibold text-white">
              Arrastre aquí su archivo
            </p>
            <p class="mt-1 text-sm text-outline-variant">
              o haga clic para seleccionarlo desde su equipo
            </p>
          </button>

          <p
            v-if="selectedImportFileName"
            class="mt-3 text-sm text-outline-variant"
          >
            Archivo seleccionado:
            <span class="font-semibold text-white">{{ selectedImportFileName }}</span>
          </p>

          <div class="mt-5 flex flex-wrap justify-end gap-2">
            <AppButton
              icon="download"
              variant="ghost"
              @click="downloadImportTemplate"
            >
              Descargar plantilla
            </AppButton>
            <AppButton
              variant="ghost"
              @click="closeImportDialog"
            >
              Cerrar
            </AppButton>
            <AppButton
              icon="upload"
              :disabled="!selectedImportFile"
              variant="primary"
              @click="processImportFile"
            >
              Procesar importación
            </AppButton>
          </div>
        </section>
      </div>
    </Teleport>

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
const isImportDialogOpen = ref(false)
const isImportDragActive = ref(false)
const selectedImportFile = ref<File | null>(null)

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
  handleImportFile,
  handleExportUsers,
  downloadImportTemplate,
} = useUsersModule()

const goToCreateUser = () => {
  void router.push('/usuarios/nuevo')
}

const goToEditUser = (userId: string) => {
  void router.push(`/usuarios/${userId}/editar`)
}

const openImportDialog = () => {
  selectedImportFile.value = null
  isImportDialogOpen.value = true
}

const closeImportDialog = () => {
  isImportDialogOpen.value = false
  isImportDragActive.value = false
  selectedImportFile.value = null
}

const openImportPicker = () => {
  triggerImport()
}

const handleImportSelectionFromInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  selectedImportFile.value = target.files?.[0] ?? null
  target.value = ''
}

const handleImportDrop = (event: DragEvent) => {
  isImportDragActive.value = false
  const droppedFile = event.dataTransfer?.files?.[0]

  if (!droppedFile) {
    return
  }

  selectedImportFile.value = droppedFile
}

const processImportFile = () => {
  if (!selectedImportFile.value) {
    return
  }

  handleImportFile(selectedImportFile.value)
  closeImportDialog()
}

const selectedImportFileName = computed(() => selectedImportFile.value?.name ?? '')

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

const hasOpenDialog = computed(() => isImportDialogOpen.value || userToDelete.value !== null)

watch(hasOpenDialog, (dialogIsOpen) => {
  if (!import.meta.client) {
    return
  }

  document.body.classList.toggle('overflow-hidden', dialogIsOpen)
})

const handleEscapeKey = (event: KeyboardEvent) => {
  if (event.key !== 'Escape') {
    return
  }

  if (isImportDialogOpen.value) {
    closeImportDialog()
    return
  }

  if (!userToDelete.value) {
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
