<template>
    <article class="w-full rounded-2xl border border-outline/30 bg-deep-navy shadow-xl">
        <header class="border-b border-outline/20 px-5 py-4 sm:px-6">
            <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <p class="text-xs uppercase tracking-[0.12em] text-secondary-container">
                        Mantenimiento de catálogo
                    </p>
                    <h2 class="mt-1 text-xl font-headline-md font-semibold text-white">
                        {{ cardTitle }}
                    </h2>
                    <p class="mt-1 text-sm text-outline-variant">
                        Completa la ficha comercial del cliente y su ubicación de referencia.
                    </p>
                </div>
                <div class="hidden items-center gap-2 sm:flex">
                    <AppButton size="md" variant="ghost" @click="$emit('cancel')">
                        Cancelar
                    </AppButton>
                    <AppButton
                        icon="save"
                        size="md"
                        type="button"
                        variant="primary"
                        @click="handleSubmit"
                    >
                        {{ mode === 'create' ? 'Crear cliente' : 'Guardar cambios' }}
                    </AppButton>
                </div>
            </div>
        </header>

        <form class="space-y-4 px-5 py-5 sm:px-6" @submit.prevent="handleSubmit">
            <section class="grid gap-4 lg:grid-cols-2">
                <article
                    class="rounded-xl border border-outline/20 bg-surface-container-low/10 p-4 sm:p-5"
                >
                    <div class="flex items-center gap-3">
                        <span class="h-12 w-1 rounded-full bg-primary" />
                        <div>
                            <h3 class="text-lg font-headline-md font-semibold text-white">
                                Datos fiscales
                            </h3>
                            <p
                                class="text-[0.65rem] uppercase tracking-[0.15em] text-secondary-container"
                            >
                                Información tributaria y legal
                            </p>
                        </div>
                    </div>

                    <div class="mt-4 grid gap-3 md:grid-cols-2">
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
                            v-model="formModel.code"
                            autocomplete="off"
                            icon="tag"
                            label="Código"
                            :disabled="true"
                            :hint="mode === 'create' ? 'Autogenerado' : ''"
                            placeholder="Autogenerado"
                        />

                        <div class="space-y-1.5">
                            <label
                                class="block text-[0.65rem] font-label-caps uppercase text-secondary-container"
                            >
                                Estado
                            </label>
                            <div
                                class="flex items-center gap-3 rounded-lg border border-outline/30 bg-surface-container-lowest/5 px-3 py-2.5"
                            >
                                <button
                                    type="button"
                                    class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                                    :class="formModel.isActive ? 'bg-primary' : 'bg-outline/40'"
                                    @click="formModel.isActive = !formModel.isActive"
                                >
                                    <span
                                        class="inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform"
                                        :class="
                                            formModel.isActive
                                                ? 'translate-x-[18px]'
                                                : 'translate-x-0.5'
                                        "
                                    />
                                </button>
                                <span
                                    class="text-sm"
                                    :class="
                                        formModel.isActive ? 'text-white' : 'text-outline-variant'
                                    "
                                >
                                    {{ formModel.isActive ? 'Activo' : 'Inactivo' }}
                                </span>
                            </div>
                        </div>

                        <div class="space-y-1.5 md:col-span-2">
                            <label
                                class="block text-[0.65rem] font-label-caps uppercase text-secondary-container"
                            >
                                Notas internas
                            </label>
                            <textarea
                                v-model="formModel.notes"
                                class="w-full rounded-lg border border-outline/30 bg-surface-container-lowest/5 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
                                rows="3"
                            />
                        </div>
                    </div>
                </article>

                <article
                    class="rounded-xl border border-outline/20 bg-surface-container-low/10 p-4 sm:p-5"
                >
                    <div class="flex items-center gap-3">
                        <span class="h-12 w-1 rounded-full bg-primary" />
                        <div>
                            <h3 class="text-lg font-headline-md font-semibold text-white">
                                Ubicación y contacto
                            </h3>
                            <p
                                class="text-[0.65rem] uppercase tracking-[0.15em] text-secondary-container"
                            >
                                Localización geográfica y enlaces
                            </p>
                        </div>
                    </div>

                    <div class="mt-4 grid gap-3 md:grid-cols-6">
                        <div class="space-y-1.5 md:col-span-2">
                            <label
                                class="block text-[0.65rem] font-label-caps uppercase text-secondary-container"
                            >
                                País <span class="text-status-error">*</span>
                            </label>
                            <AppSelect
                                v-model="formModel.country"
                                compact
                                :clearable="false"
                                icon="public"
                                :input-class="
                                    getFieldError('country')
                                        ? '!py-2.5 border-status-error focus:ring-status-error/40'
                                        : '!py-2.5'
                                "
                                :options="countrySelectOptions"
                                :searchable="false"
                                @blur="handleFieldBlur('country')"
                            />
                            <p v-if="getFieldError('country')" class="text-xs text-status-error">
                                {{ getFieldError('country') }}
                            </p>
                        </div>

                        <div class="space-y-1.5 md:col-span-2">
                            <label
                                class="block text-[0.65rem] font-label-caps uppercase text-secondary-container"
                            >
                                Departamento <span class="text-status-error">*</span>
                            </label>
                            <AppSelect
                                v-model="formModel.department"
                                compact
                                :clearable="false"
                                icon="map"
                                :input-class="
                                    getFieldError('department')
                                        ? '!py-2.5 border-status-error focus:ring-status-error/40'
                                        : '!py-2.5'
                                "
                                :options="departmentSelectOptions"
                                placeholder="Selecciona un departamento"
                                :searchable="true"
                                @blur="handleFieldBlur('department')"
                            />
                            <p v-if="getFieldError('department')" class="text-xs text-status-error">
                                {{ getFieldError('department') }}
                            </p>
                        </div>

                        <div class="md:col-span-2">
                            <AppTextField
                                v-model="formModel.city"
                                autocomplete="address-level2"
                                icon="location_city"
                                label="Ciudad"
                                :error="getFieldError('city')"
                                required
                                @blur="handleFieldBlur('city')"
                            />
                        </div>

                        <div class="space-y-1.5 md:col-span-6">
                            <label
                                class="block text-[0.65rem] font-label-caps uppercase text-secondary-container"
                            >
                                Dirección principal <span class="text-status-error">*</span>
                            </label>
                            <textarea
                                v-model="formModel.addressLine"
                                class="w-full rounded-lg border border-outline/30 bg-surface-container-lowest/5 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
                                :class="
                                    getFieldError('addressLine')
                                        ? 'border-status-error focus:border-status-error focus:ring-status-error/40'
                                        : ''
                                "
                                rows="2"
                                @blur="handleFieldBlur('addressLine')"
                            />
                            <p
                                v-if="getFieldError('addressLine')"
                                class="text-xs text-status-error"
                            >
                                {{ getFieldError('addressLine') }}
                            </p>
                        </div>

                        <div class="space-y-1.5 md:col-span-6">
                            <label
                                class="block text-[0.65rem] font-label-caps uppercase text-secondary-container"
                            >
                                Referencia de dirección
                            </label>
                            <textarea
                                v-model="formModel.addressReference"
                                class="w-full rounded-lg border border-outline/30 bg-surface-container-lowest/5 px-3 py-2.5 text-sm text-white outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/30"
                                rows="2"
                            />
                        </div>

                        <AppTextField
                            v-model="formModel.contactName"
                            autocomplete="name"
                            icon="person"
                            label="Nombre del contacto"
                            :error="getFieldError('contactName')"
                            required
                            class="md:col-span-3"
                            @blur="handleFieldBlur('contactName')"
                        />

                        <AppTextField
                            v-model="formModel.contactEmail"
                            autocomplete="email"
                            icon="mail"
                            label="Correo de contacto"
                            :error="getFieldError('contactEmail')"
                            required
                            class="md:col-span-3"
                            @blur="handleFieldBlur('contactEmail')"
                        />

                        <AppTextField
                            v-model="formModel.contactPhone"
                            autocomplete="tel"
                            icon="phone"
                            label="Teléfono de contacto"
                            :error="getFieldError('contactPhone')"
                            required
                            class="md:col-span-3"
                            @blur="handleFieldBlur('contactPhone')"
                        />
                    </div>
                </article>
            </section>

            <footer
                class="flex flex-wrap justify-end gap-2 border-t border-outline/20 pt-3 sm:hidden"
            >
                <AppButton size="md" variant="ghost" @click="$emit('cancel')"> Cancelar </AppButton>
                <AppButton icon="save" size="md" type="submit" variant="primary">
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
import {
    useFormValidation,
    validationRules,
    type ValidationSchema,
} from '~/presentation/shared/composables/forms/useFormValidation'
import type { ClientFormModel } from '~/presentation/interfaces/clients/client-form.interface'

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
const departmentSelectOptions: AppSelectOption[] = elSalvadorDepartments.map((department) => ({
    label: department,
    value: department,
}))
const formModel = reactive<ClientFormModel>({
    code: '',
    name: '',
    taxId: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    country: 'El Salvador',
    department: '',
    city: '',
    addressLine: '',
    addressReference: '',
    notes: '',
    isActive: true,
})

const schema: ValidationSchema<ClientFormModel> = {
    name: [validationRules.required<ClientFormModel>('El nombre del cliente es requerido.')],
    taxId: [validationRules.required<ClientFormModel>('El NIT es requerido.')],
    contactName: [
        validationRules.required<ClientFormModel>('El nombre del contacto es requerido.'),
    ],
    contactEmail: [
        validationRules.required<ClientFormModel>('El correo de contacto es requerido.'),
        validationRules.email<ClientFormModel>('Ingresa un correo válido.'),
    ],
    contactPhone: [
        validationRules.required<ClientFormModel>('El teléfono de contacto es requerido.'),
    ],
    country: [validationRules.required<ClientFormModel>('El país es requerido.')],
    department: [
        validationRules.required<ClientFormModel>('El departamento es requerido.'),
        validationRules.custom<ClientFormModel, string>(
            (value) => elSalvadorDepartments.includes(value.trim()),
            'Selecciona un departamento válido del catálogo.',
        ),
    ],
    city: [validationRules.required<ClientFormModel>('La ciudad es requerida.')],
    addressLine: [
        validationRules.required<ClientFormModel>('La dirección principal es requerida.'),
    ],
}

const { validateAll, validateField, setFieldTouched, getFieldError, clearValidation } =
    useFormValidation(formModel, schema)

const cardTitle = computed(() => {
    return props.mode === 'create' ? 'Crear nuevo cliente' : 'Editar cliente'
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
