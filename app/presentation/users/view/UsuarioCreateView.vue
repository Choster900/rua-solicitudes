<template>
  <AppShellLayout screen-title="Usuarios">
    <section class="mx-auto w-full max-w-5xl space-y-4">
      <button
        class="inline-flex items-center gap-1 rounded-lg border border-outline/30 px-3 py-2 text-sm text-outline-variant transition-colors hover:bg-surface-container-low/10 hover:text-white"
        type="button"
        @click="goBackToUsers"
      >
        <span class="material-symbols-outlined text-[18px]">arrow_back</span>
        Volver a usuarios
      </button>

      <UserFormCard
        mode="create"
        :model="userFormModel"
        @cancel="goBackToUsers"
        @submit="handleCreateUser"
      />
    </section>
  </AppShellLayout>
</template>

<script setup lang="ts">
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'
import UserFormCard from '~/presentation/users/components/UserFormCard.vue'
import { useUsersModule } from '~/presentation/users/composables/useUsersModule'
import type { UserFormModel } from '~/presentation/users/interfaces/user-form.interface'

defineOptions({
  name: 'UsuarioCreateView',
})

const router = useRouter()
const { createEmptyUserFormModel, createUser } = useUsersModule()
const userFormModel = createEmptyUserFormModel()

const goBackToUsers = () => {
  void router.push('/usuarios')
}

const handleCreateUser = (formModel: UserFormModel) => {
  createUser(formModel)
  goBackToUsers()
}

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
