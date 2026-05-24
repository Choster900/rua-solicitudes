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
        @delete-user="deleteUser"
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
  </AppShellLayout>
</template>

<script setup lang="ts">
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'
import UsersDataTable from '~/presentation/users/components/UsersDataTable.vue'
import UsersToolbar from '~/presentation/users/components/UsersToolbar.vue'
import { useUsersModule } from '~/presentation/users/composables/useUsersModule'

defineOptions({
  name: 'UsuariosView',
})

const router = useRouter()

const {
  importInputRef,
  totalUsers,
  activeUsers,
  pendingUsers,
  blockedUsers,
  userTableRows,
  deleteUser,
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
