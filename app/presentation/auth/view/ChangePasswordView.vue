<template>
  <main class="flex min-h-screen w-full items-center justify-center bg-deep-navy px-4 py-8 text-on-surface">
    <section class="w-full max-w-md rounded-2xl border border-outline/30 bg-surface-container-lowest/10 p-6 shadow-2xl">
      <p class="text-xs uppercase tracking-[0.12em] text-secondary-container">
        Primer ingreso
      </p>
      <h1 class="mt-1 text-xl font-headline-md font-black text-white">
        Actualizar contraseña
      </h1>
      <p class="mt-2 text-sm text-outline-variant">
        Por seguridad, debes definir una nueva contraseña antes de continuar.
      </p>

      <form
        class="mt-5 space-y-4"
        @submit.prevent="handleSubmit"
      >
        <AppTextField
          v-model="currentPassword"
          autocomplete="current-password"
          icon="lock"
          label="Contraseña temporal"
          :error="currentPasswordError"
          required
          type="password"
          @blur="validateCurrentPassword"
        />

        <AppTextField
          v-model="newPassword"
          autocomplete="new-password"
          icon="password"
          label="Nueva contraseña"
          :error="newPasswordError"
          required
          type="password"
          @blur="validateNewPassword"
        />

        <AppTextField
          v-model="confirmPassword"
          autocomplete="new-password"
          icon="password"
          label="Confirmar contraseña"
          :error="confirmPasswordError"
          required
          type="password"
          @blur="validateConfirmPassword"
        />

        <AppButton
          class="w-full"
          :disabled="isSubmitting"
          icon="save"
          type="submit"
          variant="primary"
        >
          {{ isSubmitting ? 'Actualizando...' : 'Guardar nueva contraseña' }}
        </AppButton>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppButton from '~/presentation/shared/components/ui/AppButton.vue'
import AppTextField from '~/presentation/shared/components/ui/AppTextField.vue'
import { useApiClient } from '~/presentation/shared/composables/useApiClient'
import { useAppToast } from '~/presentation/shared/composables/useAppToast'
import type { HttpClientError } from '~/presentation/interfaces/shared/http/http-client-error.interface'

defineOptions({
  name: 'ChangePasswordView',
})

const router = useRouter()
const apiClient = useApiClient()
const toast = useAppToast()
const accessToken = useCookie<string | null>('access_token')

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const currentPasswordError = ref('')
const newPasswordError = ref('')
const confirmPasswordError = ref('')
const isSubmitting = ref(false)

const validateCurrentPassword = () => {
  currentPasswordError.value = currentPassword.value.trim() ? '' : 'La contraseña temporal es requerida.'
}

const validateNewPassword = () => {
  const trimmedPassword = newPassword.value.trim()

  if (!trimmedPassword) {
    newPasswordError.value = 'La nueva contraseña es requerida.'
    return
  }

  if (trimmedPassword.length < 8) {
    newPasswordError.value = 'Debe tener al menos 8 caracteres.'
    return
  }

  newPasswordError.value = ''
}

const validateConfirmPassword = () => {
  const trimmedConfirmation = confirmPassword.value.trim()

  if (!trimmedConfirmation) {
    confirmPasswordError.value = 'Debes confirmar la contraseña.'
    return
  }

  confirmPasswordError.value = trimmedConfirmation === newPassword.value.trim()
    ? ''
    : 'Las contraseñas no coinciden.'
}

const validateForm = () => {
  validateCurrentPassword()
  validateNewPassword()
  validateConfirmPassword()

  return !currentPasswordError.value && !newPasswordError.value && !confirmPasswordError.value
}

const handleSubmit = async () => {
  if (isSubmitting.value) {
    return
  }

  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  try {
    const response = await apiClient.post<{
      accessToken: string
      expiresInSeconds: number
      tokenType: 'Bearer'
    }>('/auth/change-password', {
      currentPassword: currentPassword.value.trim(),
      newPassword: newPassword.value.trim(),
    })

    accessToken.value = response.data.accessToken
    toast.success('Contraseña actualizada correctamente.')
    void router.push('/dashboard')
  }
  catch (error) {
    const httpError = error as HttpClientError
    toast.error(httpError.message || 'No se pudo actualizar la contraseña.')
  }
  finally {
    isSubmitting.value = false
  }
}

useHead({
  title: 'RUASA ERP - Cambio de contraseña',
  htmlAttrs: {
    class: 'dark',
    lang: 'es',
  },
  bodyAttrs: {
    class: 'bg-deep-navy font-body-md text-on-surface',
  },
})
</script>
