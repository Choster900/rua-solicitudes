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

      <article
        v-if="!userFormModel"
        class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 p-6"
      >
        <h2 class="text-lg font-semibold text-white">
          Usuario no encontrado
        </h2>
        <p class="mt-1 text-sm text-outline-variant">
          El usuario que intentas editar no existe o fue eliminado.
        </p>
      </article>

      <UserFormCard
        v-else
        mode="edit"
        :model="userFormModel"
        @cancel="goBackToUsers"
        @submit="handleUpdateUser"
      />
    </section>
  </AppShellLayout>
</template>

<script setup lang="ts">
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'
import UserFormCard from '~/presentation/users/components/UserFormCard.vue'
import { useUsersModule } from '~/presentation/users/composables/useUsersModule'
import type { UserFormModel } from '~/presentation/interfaces/users/user-form.interface'

defineOptions({
  name: 'UsuarioEditView',
})

const route = useRoute()
const router = useRouter()
const userId = computed(() => String(route.params.id ?? ''))
const { getUserFormModelById, updateUser } = useUsersModule()

const userFormModel = computed(() => {
  if (!userId.value) {
    return null
  }

  return getUserFormModelById(userId.value)
})

const goBackToUsers = () => {
  void router.push('/usuarios')
}

const handleUpdateUser = (formModel: UserFormModel) => {
  if (!userId.value) {
    return
  }

  const updated = updateUser(userId.value, formModel)

  if (updated) {
    goBackToUsers()
  }
}

useHead(() => ({
  title: 'RUASA ERP - Editar Usuario',
  htmlAttrs: {
    lang: 'es',
  },
  bodyAttrs: {
    class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant',
  },
}))
</script>
