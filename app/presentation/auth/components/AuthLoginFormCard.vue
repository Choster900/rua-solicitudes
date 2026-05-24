<template>
  <section class="w-full lg:w-5/12 flex flex-col items-center justify-center bg-deep-navy px-5 py-8 sm:px-8 sm:py-10 lg:border-l lg:border-outline/10 lg:px-container-padding">
    <div class="w-full max-w-sm sm:max-w-md lg:max-w-sm flex flex-col items-center">
      <div class="mb-6 animate-fade-in">
        <img
          alt="RUASA Logo"
          class="h-12 w-auto object-contain brightness-0 invert opacity-90"
          src="https://lh3.googleusercontent.com/aida/ADBb0ujiXx9N50DdfTe9CfsLyYlpeSMdQBeJ4edwvqQHduYKretEy9UGjRUgBUvuM-ZF69AH2oixZbYNwCBqGrFl1ob-apaw0fpIBU_SE-RBpEk-mdcZjCdDp1zpWl7OBELMyvXbGBehb0pwHrE6PHbRsdBiyvdSqWrx37WjPVhLU4TPPorf2yfIO0HauZa76jOR0KmeXYi4JZUuLwDlfjup7DP5xw5zc5ATh1GAPiF5kb37UfcX_eNV_y9MdQ"
        >
      </div>

      <div class="mb-6 w-full text-center">
        <h2 class="mb-1 text-[1.3rem] font-headline-md text-white">
          Acceso al Portal de Producción
        </h2>
        <p class="text-[0.8rem] font-body-sm text-outline-variant">
          Ingrese sus credenciales corporativas para continuar
        </p>
      </div>

      <form
        class="w-full space-y-4"
        @submit.prevent="handleSubmit"
      >
        <AppTextField
          v-model="formValues.networkUser"
          name="network-user"
          label="Usuario de Red"
          placeholder="usuario@ruasa.com.sv"
          icon="person"
          autocomplete="username"
          required
          :error="getFieldError('networkUser')"
          @blur="handleFieldBlur('networkUser')"
        />

        <AppTextField
          v-model="formValues.password"
          name="password"
          label="Contraseña"
          placeholder="••••••••"
          type="password"
          icon="lock"
          autocomplete="current-password"
          required
          :error="getFieldError('password')"
          @blur="handleFieldBlur('password')"
        />

        <div class="flex flex-wrap items-center justify-between gap-2 py-1">
          <AppCheckbox
            v-model="formValues.rememberMe"
            label="Recordarme"
            name="remember-me"
          />

          <button
            class="text-right text-[0.8rem] font-bold text-primary-fixed-dim transition-colors hover:text-white"
            type="button"
            @click="$emit('forgotPassword')"
          >
            ¿Olvidó su contraseña?
          </button>
        </div>

        <AppButton
          type="submit"
          icon="login"
          size="md"
          full-width
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          {{ isSubmitSuccess ? 'Acceso concedido' : 'Ingresar al Sistema' }}
        </AppButton>
      </form>

      <footer class="mt-8 text-center sm:mt-10">
        <p class="text-[10px] font-label-caps uppercase tracking-widest text-outline/50">
          © 2024 RUASA Enterprise Resource Planning<br>
          Seguridad de Grado Industrial • v2.4.0
        </p>
      </footer>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onUnmounted, reactive, ref } from 'vue'
import AppButton from '~/presentation/shared/components/ui/AppButton.vue'
import AppCheckbox from '~/presentation/shared/components/ui/AppCheckbox.vue'
import AppTextField from '~/presentation/shared/components/ui/AppTextField.vue'
import {
  useFormValidation,
  validationRules,
} from '~/presentation/shared/composables/forms/useFormValidation'
import type { AuthLoginFormValues } from '~/presentation/auth/interfaces/auth-login-form.interface'

defineOptions({
  name: 'AuthLoginFormCard',
})

const emit = defineEmits<{
  submitSuccess: [values: AuthLoginFormValues]
  forgotPassword: []
}>()

const formValues = reactive<AuthLoginFormValues>({
  networkUser: '',
  password: '',
  rememberMe: false,
})

const validation = useFormValidation(formValues, {
  networkUser: [
    validationRules.required<AuthLoginFormValues>('El usuario de red es requerido.'),
  ],
  password: [
    validationRules.required<AuthLoginFormValues>('La contraseña es requerida.'),
  ],
})

const { validateAll, validateField, setFieldTouched, getFieldError } = validation

const isSubmitting = ref(false)
const isSubmitSuccess = ref(false)
let submitTimeoutId: number | null = null
let successTimeoutId: number | null = null

const handleFieldBlur = (field: 'networkUser' | 'password') => {
  setFieldTouched(field, true)
  validateField(field)
}

const handleSubmit = () => {
  const isValid = validateAll()

  if (!isValid || isSubmitting.value) {
    return
  }

  isSubmitting.value = true
  isSubmitSuccess.value = false

  submitTimeoutId = window.setTimeout(() => {
    isSubmitSuccess.value = true
    isSubmitting.value = false

    successTimeoutId = window.setTimeout(() => {
      emit('submitSuccess', { ...formValues })
    }, 800)
  }, 1400)
}

onUnmounted(() => {
  if (submitTimeoutId !== null) {
    window.clearTimeout(submitTimeoutId)
  }

  if (successTimeoutId !== null) {
    window.clearTimeout(successTimeoutId)
  }
})
</script>
