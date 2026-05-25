<template>
  <article class="w-full rounded-2xl border border-outline/30 bg-deep-navy shadow-xl">
    <header class="border-b border-outline/20 px-5 py-4">
      <p class="text-xs uppercase tracking-[0.12em] text-secondary-container">
        Administración de acceso
      </p>
      <h2 class="mt-1 text-xl font-headline-md font-semibold text-white">
        {{ cardTitle }}
      </h2>
      <p class="mt-1 text-sm text-outline-variant">
        La contraseña no se define aquí. El usuario recibirá acceso temporal por correo.
      </p>
    </header>

    <form
      class="space-y-4 px-5 py-5"
      @submit.prevent="handleSubmit"
    >
      <div class="grid gap-4 md:grid-cols-2">
        <AppTextField
          v-model="formModel.employeeCode"
          autocomplete="off"
          icon="badge"
          label="Código de empleado"
          :error="getFieldError('employeeCode')"
          placeholder="EMP-1008"
          required
          @blur="handleFieldBlur('employeeCode')"
        />
        <AppTextField
          v-model="formModel.fullName"
          autocomplete="name"
          icon="person"
          label="Nombre completo"
          :error="getFieldError('fullName')"
          required
          @blur="handleFieldBlur('fullName')"
        />
        <AppTextField
          v-model="formModel.email"
          autocomplete="email"
          icon="mail"
          label="Correo corporativo"
          :error="getFieldError('email')"
          required
          @blur="handleFieldBlur('email')"
        />
        <AppTextField
          v-model="formModel.phone"
          autocomplete="tel"
          icon="phone"
          label="Teléfono"
          :error="getFieldError('phone')"
          required
          @blur="handleFieldBlur('phone')"
        />

        <div class="space-y-1.5">
          <label class="block text-[0.65rem] font-label-caps uppercase text-secondary-container">
            Tipo de usuario <span class="text-status-error">*</span>
          </label>
          <AppSelect
            v-model="formModel.userType"
            compact
            icon="manage_accounts"
            :input-class="getFieldError('userType')
              ? '!py-1.5 border-status-error focus:ring-status-error/40'
              : '!py-1.5'"
            :options="userTypeSelectOptions"
            placeholder="Selecciona el tipo de usuario"
            @blur="handleFieldBlur('userType')"
          />
          <p
            v-if="getFieldError('userType')"
            class="text-xs text-status-error"
          >
            {{ getFieldError('userType') }}
          </p>
        </div>

        <AppTextField
          v-model="formModel.department"
          autocomplete="organization"
          icon="domain"
          label="Área / Departamento"
          :error="getFieldError('department')"
          required
          @blur="handleFieldBlur('department')"
        />

        <div class="space-y-1.5 md:col-span-2">
          <label class="block text-[0.65rem] font-label-caps uppercase text-secondary-container">
            Estado de usuario <span class="text-status-error">*</span>
          </label>
          <AppSelect
            v-model="formModel.status"
            compact
            :clearable="false"
            :input-class="getFieldError('status')
              ? '!py-1.5 border-status-error focus:ring-status-error/40'
              : '!py-1.5'"
            icon="verified"
            :options="userStatusSelectOptions"
            :searchable="false"
            @blur="handleFieldBlur('status')"
          />
          <p
            v-if="getFieldError('status')"
            class="text-xs text-status-error"
          >
            {{ getFieldError('status') }}
          </p>
        </div>
      </div>

      <footer class="flex flex-wrap justify-end gap-2 border-t border-outline/20 pt-4">
        <AppButton
          size="md"
          variant="ghost"
          @click="$emit('cancel')"
        >
          Cancelar
        </AppButton>
        <AppButton
          icon="save"
          size="md"
          type="submit"
          variant="primary"
        >
          {{ mode === 'create' ? 'Crear usuario' : 'Guardar cambios' }}
        </AppButton>
      </footer>
    </form>
  </article>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import AppButton from '~/presentation/shared/components/ui/AppButton.vue'
import AppSelect from '~/presentation/shared/components/ui/AppSelect.vue'
import AppTextField from '~/presentation/shared/components/ui/AppTextField.vue'
import { useFormValidation, validationRules, type ValidationSchema } from '~/presentation/shared/composables/forms/useFormValidation'
import type { UserFormModel } from '~/presentation/users/interfaces/user-form.interface'
import type { UserStatus, UserType } from '~/presentation/users/interfaces/user.interface'

type UserFormMode = 'create' | 'edit'

interface UserFormCardProps {
  mode: UserFormMode
  model: UserFormModel
}

defineOptions({
  name: 'UserFormCard',
})

const props = defineProps<UserFormCardProps>()

const emit = defineEmits<{
  cancel: []
  submit: [model: UserFormModel]
}>()

const userTypeOptions: UserType[] = ['Vendedor', 'Diseñador', 'Calidad', 'Administrativo', 'Gerencia']
const userStatusOptions: UserStatus[] = ['Activo', 'Pendiente', 'Bloqueado']
const userTypeSelectOptions = userTypeOptions.map(userType => ({ label: userType, value: userType }))
const userStatusSelectOptions = userStatusOptions.map(status => ({ label: status, value: status }))
const formModel = reactive<UserFormModel>({
  employeeCode: '',
  fullName: '',
  email: '',
  phone: '',
  userType: '',
  department: '',
  status: 'Pendiente',
})

const schema: ValidationSchema<UserFormModel> = {
  employeeCode: [validationRules.required<UserFormModel>('El código de empleado es requerido.')],
  fullName: [validationRules.required<UserFormModel>('El nombre completo es requerido.')],
  email: [
    validationRules.required<UserFormModel>('El correo corporativo es requerido.'),
    validationRules.email<UserFormModel>('Ingresa un correo válido.'),
  ],
  phone: [validationRules.required<UserFormModel>('El teléfono es requerido.')],
  userType: [validationRules.required<UserFormModel>('Debes seleccionar un tipo de usuario.')],
  department: [validationRules.required<UserFormModel>('El área o departamento es requerido.')],
  status: [validationRules.required<UserFormModel>('Debes seleccionar un estado.')],
}

const {
  validateAll,
  validateField,
  setFieldTouched,
  getFieldError,
  clearValidation,
} = useFormValidation(formModel, schema)

const cardTitle = computed(() => {
  return props.mode === 'create' ? 'Crear nuevo usuario' : 'Editar usuario'
})

const syncFormModel = () => {
  Object.assign(formModel, props.model)
}

const handleFieldBlur = (field: keyof UserFormModel) => {
  setFieldTouched(field)
  validateField(field)
}

const handleSubmit = () => {
  if (!validateAll()) {
    return
  }

  emit('submit', { ...formModel })
  clearValidation()
}

watch(
  () => props.model,
  () => {
    syncFormModel()
    clearValidation()
  },
  { immediate: true, deep: true },
)
</script>
