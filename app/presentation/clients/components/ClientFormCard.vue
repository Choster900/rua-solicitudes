<template>
  <article class="w-full rounded-2xl border border-outline/30 bg-deep-navy shadow-xl">
    <header class="border-b border-outline/20 px-5 py-4">
      <p class="text-xs uppercase tracking-[0.12em] text-secondary-container">
        Mantenimiento de catálogo
      </p>
      <h2 class="mt-1 text-xl font-headline-md font-semibold text-white">
        {{ cardTitle }}
      </h2>
      <p class="mt-1 text-sm text-outline-variant">
        Completa la ficha comercial del cliente y su ubicación de referencia.
      </p>
    </header>

    <form
      class="space-y-5 px-5 py-5"
      @submit.prevent="handleSubmit"
    >
      <section class="space-y-3">
        <h3 class="text-xs uppercase tracking-[0.12em] text-secondary-container">
          Información General
        </h3>

        <div class="grid gap-4 md:grid-cols-2">
          <AppTextField
            v-model="formModel.code"
            autocomplete="off"
            icon="tag"
            label="Código"
            :error="getFieldError('code')"
            placeholder="CLI-009"
            required
            @blur="handleFieldBlur('code')"
          />

          <AppTextField
            v-model="formModel.taxId"
            autocomplete="off"
            icon="badge"
            label="NIT / Documento Fiscal"
            :error="getFieldError('taxId')"
            placeholder="0614-000000-000-0"
            required
            @blur="handleFieldBlur('taxId')"
          />

          <AppTextField
            v-model="formModel.name"
            autocomplete="organization"
            icon="business"
            label="Nombre del cliente"
            :error="getFieldError('name')"
            required
            @blur="handleFieldBlur('name')"
          />

          <AppTextField
            v-model="formModel.segment"
            autocomplete="off"
            icon="category"
            label="Segmento"
            :error="getFieldError('segment')"
            required
            @blur="handleFieldBlur('segment')"
          />

          <div class="space-y-1.5 md:col-span-2">
            <label class="block text-[0.65rem] font-label-caps uppercase text-secondary-container">
              Estado <span class="text-status-error">*</span>
            </label>
            <AppSelect
              v-model="formModel.status"
              compact
              :clearable="false"
              :input-class="getFieldError('status')
                ? '!py-1.5 border-status-error focus:ring-status-error/40'
                : '!py-1.5'"
              icon="verified"
              :options="statusSelectOptions"
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
      </section>

      <section class="space-y-3 border-t border-outline/20 pt-5">
        <h3 class="text-xs uppercase tracking-[0.12em] text-secondary-container">
          Contacto Comercial
        </h3>

        <div class="grid gap-4 md:grid-cols-2">
          <AppTextField
            v-model="formModel.contactName"
            autocomplete="name"
            icon="person"
            label="Nombre del contacto"
            :error="getFieldError('contactName')"
            required
            @blur="handleFieldBlur('contactName')"
          />

          <AppTextField
            v-model="formModel.contactPhone"
            autocomplete="tel"
            icon="phone"
            label="Teléfono de contacto"
            :error="getFieldError('contactPhone')"
            required
            @blur="handleFieldBlur('contactPhone')"
          />

          <AppTextField
            v-model="formModel.contactEmail"
            autocomplete="email"
            icon="mail"
            label="Correo de contacto"
            :error="getFieldError('contactEmail')"
            required
            @blur="handleFieldBlur('contactEmail')"
          />

          <AppTextField
            v-model="formModel.website"
            autocomplete="url"
            icon="language"
            label="Sitio web"
            :error="getFieldError('website')"
            placeholder="https://cliente.com"
            @blur="handleFieldBlur('website')"
          />
        </div>
      </section>

      <section class="space-y-3 border-t border-outline/20 pt-5">
        <h3 class="text-xs uppercase tracking-[0.12em] text-secondary-container">
          Dirección y Ubicación
        </h3>

        <div class="grid gap-4 md:grid-cols-2">
          <div class="space-y-1.5">
            <label class="block text-[0.65rem] font-label-caps uppercase text-secondary-container">
              País <span class="text-status-error">*</span>
            </label>
            <AppSelect
              v-model="formModel.country"
              compact
              :clearable="false"
              icon="public"
              :input-class="getFieldError('country')
                ? '!py-1.5 border-status-error focus:ring-status-error/40'
                : '!py-1.5'"
              :options="countrySelectOptions"
              :searchable="false"
              @blur="handleFieldBlur('country')"
            />
            <p
              v-if="getFieldError('country')"
              class="text-xs text-status-error"
            >
              {{ getFieldError('country') }}
            </p>
          </div>

          <div class="space-y-1.5">
            <label class="block text-[0.65rem] font-label-caps uppercase text-secondary-container">
              Departamento <span class="text-status-error">*</span>
            </label>
            <AppSelect
              v-model="formModel.department"
              compact
              :clearable="false"
              icon="map"
              :input-class="getFieldError('department')
                ? '!py-1.5 border-status-error focus:ring-status-error/40'
                : '!py-1.5'"
              :options="departmentSelectOptions"
              placeholder="Selecciona un departamento"
              :searchable="true"
              @blur="handleFieldBlur('department')"
            />
            <p
              v-if="getFieldError('department')"
              class="text-xs text-status-error"
            >
              {{ getFieldError('department') }}
            </p>
          </div>

          <AppTextField
            v-model="formModel.city"
            autocomplete="address-level2"
            icon="location_city"
            label="Ciudad"
            :error="getFieldError('city')"
            required
            @blur="handleFieldBlur('city')"
          />

          <AppTextField
            v-model="formModel.googleMapsUrl"
            autocomplete="url"
            icon="pin_drop"
            label="URL Google Maps"
            :error="getFieldError('googleMapsUrl')"
            placeholder="https://maps.google.com/..."
            @blur="handleFieldBlur('googleMapsUrl')"
          />

          <div class="space-y-1.5 md:col-span-2">
            <label class="block text-[0.65rem] font-label-caps uppercase text-secondary-container">
              Dirección principal <span class="text-status-error">*</span>
            </label>
            <textarea
              v-model="formModel.addressLine"
              class="w-full rounded-lg border border-outline/30 bg-surface-container-lowest/5 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
              :class="getFieldError('addressLine') ? 'border-status-error focus:border-status-error focus:ring-status-error/40' : ''"
              rows="3"
              @blur="handleFieldBlur('addressLine')"
            />
            <p
              v-if="getFieldError('addressLine')"
              class="text-xs text-status-error"
            >
              {{ getFieldError('addressLine') }}
            </p>
          </div>

          <div class="space-y-1.5 md:col-span-2">
            <label class="block text-[0.65rem] font-label-caps uppercase text-secondary-container">
              Referencia de dirección
            </label>
            <textarea
              v-model="formModel.addressReference"
              class="w-full rounded-lg border border-outline/30 bg-surface-container-lowest/5 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
              rows="2"
            />
          </div>
        </div>

        <article class="rounded-xl border border-outline/20 bg-surface-container-low/10 p-3.5">
          <div class="mb-2 flex items-center justify-between gap-2">
            <p class="text-xs font-semibold text-white">
              Referencia en mapa
            </p>
            <a
              class="inline-flex items-center gap-1 rounded-lg border border-outline/20 px-2.5 py-1 text-xs font-semibold text-sky-200 transition-colors hover:bg-sky-500/10 hover:text-sky-100"
              :href="mapOpenUrl"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span class="material-symbols-outlined text-[14px]">open_in_new</span>
              Abrir en Google Maps
            </a>
          </div>
          <iframe
            class="h-56 w-full rounded-lg border border-outline/20"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            :src="mapEmbedUrl"
            title="Mapa de referencia del cliente"
          />
        </article>
      </section>

      <section class="space-y-1.5 border-t border-outline/20 pt-5">
        <label class="block text-[0.65rem] font-label-caps uppercase text-secondary-container">
          Notas internas
        </label>
        <textarea
          v-model="formModel.notes"
          class="w-full rounded-lg border border-outline/30 bg-surface-container-lowest/5 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
          rows="3"
        />
      </section>

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
          {{ mode === 'create' ? 'Crear cliente' : 'Guardar cambios' }}
        </AppButton>
      </footer>
    </form>
  </article>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import AppButton from '~/presentation/shared/components/ui/AppButton.vue'
import AppSelect, { type AppSelectOption } from '~/presentation/shared/components/ui/AppSelect.vue'
import AppTextField from '~/presentation/shared/components/ui/AppTextField.vue'
import { useFormValidation, validationRules, type ValidationSchema } from '~/presentation/shared/composables/forms/useFormValidation'
import type { ClientFormModel } from '~/presentation/interfaces/clients/client-form.interface'
import type { ClientStatus } from '~/presentation/interfaces/clients/client.interface'

type ClientFormMode = 'create' | 'edit'

interface ClientFormCardProps {
  mode: ClientFormMode
  model: ClientFormModel
}

defineOptions({
  name: 'ClientFormCard',
})

const props = defineProps<ClientFormCardProps>()

const emit = defineEmits<{
  cancel: []
  submit: [model: ClientFormModel]
}>()

const statusOptions: ClientStatus[] = ['Activo', 'Prospecto', 'Inactivo']
const statusSelectOptions = statusOptions.map(status => ({ label: status, value: status }))
const countrySelectOptions: AppSelectOption[] = [{ label: 'El Salvador', value: 'El Salvador' }]
const elSalvadorDepartments = [
  'Ahuachapan',
  'Cabanas',
  'Chalatenango',
  'Cuscatlan',
  'La Libertad',
  'La Paz',
  'La Union',
  'Morazan',
  'San Miguel',
  'San Salvador',
  'San Vicente',
  'Santa Ana',
  'Sonsonate',
  'Usulutan',
]
const departmentSelectOptions: AppSelectOption[] = elSalvadorDepartments.map(department => ({
  label: department,
  value: department,
}))
const mapFallbackQuery = 'El Salvador'

const formModel = reactive<ClientFormModel>({
  code: '',
  name: '',
  taxId: '',
  segment: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  country: 'El Salvador',
  department: '',
  city: '',
  addressLine: '',
  addressReference: '',
  website: '',
  googleMapsUrl: '',
  notes: '',
  status: 'Prospecto',
})

const schema: ValidationSchema<ClientFormModel> = {
  code: [validationRules.required<ClientFormModel>('El código es requerido.')],
  name: [validationRules.required<ClientFormModel>('El nombre del cliente es requerido.')],
  taxId: [validationRules.required<ClientFormModel>('El NIT es requerido.')],
  segment: [validationRules.required<ClientFormModel>('El segmento es requerido.')],
  contactName: [validationRules.required<ClientFormModel>('El nombre del contacto es requerido.')],
  contactEmail: [
    validationRules.required<ClientFormModel>('El correo de contacto es requerido.'),
    validationRules.email<ClientFormModel>('Ingresa un correo válido.'),
  ],
  contactPhone: [validationRules.required<ClientFormModel>('El teléfono de contacto es requerido.')],
  country: [validationRules.required<ClientFormModel>('El país es requerido.')],
  department: [
    validationRules.required<ClientFormModel>('El departamento es requerido.'),
    validationRules.custom<ClientFormModel, string>(
      value => elSalvadorDepartments.includes(value.trim()),
      'Selecciona un departamento válido del catálogo.',
    ),
  ],
  city: [validationRules.required<ClientFormModel>('La ciudad es requerida.')],
  addressLine: [validationRules.required<ClientFormModel>('La dirección principal es requerida.')],
  status: [validationRules.required<ClientFormModel>('Debes seleccionar un estado.')],
  website: [
    validationRules.custom<ClientFormModel, string>(
      value => value.trim().length === 0 || /^https?:\/\//.test(value.trim()),
      'El sitio web debe iniciar con http:// o https://',
    ),
  ],
  googleMapsUrl: [
    validationRules.custom<ClientFormModel, string>(
      value => value.trim().length === 0 || /^https?:\/\//.test(value.trim()),
      'La URL de Google Maps debe iniciar con http:// o https://',
    ),
  ],
}

const {
  validateAll,
  validateField,
  setFieldTouched,
  getFieldError,
  clearValidation,
} = useFormValidation(formModel, schema)

const cardTitle = computed(() => {
  return props.mode === 'create' ? 'Crear nuevo cliente' : 'Editar cliente'
})

const mapQuery = computed(() => {
  if (formModel.googleMapsUrl.trim()) {
    return formModel.googleMapsUrl.trim()
  }

  const composed = [
    formModel.addressLine,
    formModel.city,
    formModel.department,
    formModel.country,
    formModel.name,
  ]
    .map(value => value.trim())
    .filter(value => value.length > 0)
    .join(', ')

  return composed || mapFallbackQuery
})

const mapEmbedUrl = computed(() => {
  return `https://www.google.com/maps?q=${encodeURIComponent(mapQuery.value)}&output=embed`
})

const mapOpenUrl = computed(() => {
  if (formModel.googleMapsUrl.trim()) {
    return formModel.googleMapsUrl.trim()
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery.value)}`
})

const syncFormModel = () => {
  Object.assign(formModel, props.model)
}

const handleFieldBlur = (field: keyof ClientFormModel) => {
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
