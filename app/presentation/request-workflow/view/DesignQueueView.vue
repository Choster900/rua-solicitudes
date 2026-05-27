<template>
    <AppShellLayout screen-title="Bandeja Diseño">
        <section class="space-y-5">
            <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <article
                    class="rounded-xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3"
                >
                    <p class="text-xs uppercase tracking-[0.12em] text-outline-variant">Artes</p>
                    <p class="mt-1 text-3xl font-semibold text-white">{{ artsCount }}</p>
                </article>
                <article
                    class="rounded-xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3"
                >
                    <p class="text-xs uppercase tracking-[0.12em] text-outline-variant">Dummies</p>
                    <p class="mt-1 text-3xl font-semibold text-white">{{ dummiesCount }}</p>
                </article>
                <article
                    class="rounded-xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3"
                >
                    <p class="text-xs uppercase tracking-[0.12em] text-outline-variant">
                        Mecánicos
                    </p>
                    <p class="mt-1 text-3xl font-semibold text-white">{{ mechanicsCount }}</p>
                </article>
                <article
                    class="rounded-xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3"
                >
                    <p class="text-xs uppercase tracking-[0.12em] text-outline-variant">
                        Pendientes Calidad
                    </p>
                    <p class="mt-1 text-3xl font-semibold text-white">{{ pendingQualityCount }}</p>
                </article>
            </div>

            <article
                class="overflow-hidden rounded-xl border border-outline/20 bg-surface-container-lowest/5"
            >
                <header
                    class="flex items-center justify-between border-b border-outline/20 px-4 py-3"
                >
                    <h2 class="text-xs uppercase tracking-[0.12em] text-secondary-container">
                        Solicitudes en Proceso
                    </h2>
                    <AppButton size="sm" variant="ghost" @click="triggerImport">
                        Filtros
                    </AppButton>
                </header>

                <div class="overflow-x-auto">
                    <table class="min-w-full">
                        <thead>
                            <tr
                                class="border-b border-outline/20 text-left text-xs uppercase tracking-[0.08em] text-outline-variant"
                            >
                                <th class="px-4 py-3">Solicitud</th>
                                <th class="px-4 py-3">Cliente</th>
                                <th class="px-4 py-3">Producto</th>
                                <th class="px-4 py-3">Diseñador</th>
                                <th class="px-4 py-3 text-center">Arte</th>
                                <th class="px-4 py-3 text-center">Dummie</th>
                                <th class="px-4 py-3 text-center">Mecánico</th>
                                <th class="px-4 py-3 text-center">Estado</th>
                                <th class="px-4 py-3 text-center">Acciones</th>
                                <th class="px-4 py-3 text-center">Enviar</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr
                                v-for="(row, index) in displayRows"
                                :key="row.id"
                                class="border-b border-outline/15 transition-colors hover:bg-surface-container-low/10"
                                :class="selectedRequestId === row.id ? 'bg-primary/10' : ''"
                                @click="selectedRequestId = row.id"
                            >
                                <td class="px-4 py-3 text-sm font-semibold text-white">
                                    {{ row.requestCode }}
                                </td>
                                <td class="px-4 py-3 text-sm text-outline-variant">
                                    {{ row.clientName }}
                                </td>
                                <td class="px-4 py-3 text-sm text-outline-variant">
                                    {{ row.productName }}
                                </td>
                                <td class="px-4 py-3" @click.stop>
                                    <div class="flex flex-col gap-1">
                                        <div
                                            v-if="row.assignedDesigners.length"
                                            class="flex flex-wrap gap-1"
                                        >
                                            <span
                                                v-for="a in row.assignedDesigners"
                                                :key="a.designerId"
                                                class="inline-flex items-center gap-0.5 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] text-primary-fixed-dim"
                                            >
                                                {{ a.designerName }}
                                                <button
                                                    v-if="isJefe"
                                                    type="button"
                                                    class="ml-0.5 leading-none text-outline-variant hover:text-red-400"
                                                    title="Quitar asignación"
                                                    @click.stop="
                                                        onRemoveDesigner(row.id, a.designerId)
                                                    "
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        </div>
                                        <select
                                            v-if="
                                                isJefe &&
                                                (row.status === 'PENDING_ASSIGNMENT' ||
                                                    row.status === 'ASSIGNED') &&
                                                getAvailableDesigners(row).length > 0
                                            "
                                            value=""
                                            class="w-full rounded-md border border-outline/30 bg-surface-container-lowest/20 px-2 py-1 text-xs text-outline-variant focus:border-primary focus:outline-none"
                                            @change="onAssignDesigner(row.id, $event)"
                                        >
                                            <option value="" class="bg-[#0D1E2E]">
                                                + Asignar...
                                            </option>
                                            <option
                                                v-for="designer in getAvailableDesigners(row)"
                                                :key="designer.id"
                                                :value="designer.id"
                                                class="bg-[#0D1E2E] text-white"
                                            >
                                                {{ designer.fullName }}
                                            </option>
                                        </select>
                                        <span
                                            v-if="!row.assignedDesigners.length && !isJefe"
                                            class="text-sm text-outline-variant/50"
                                            >—</span
                                        >
                                    </div>
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <span
                                        class="inline-flex h-5 w-5 items-center justify-center rounded border border-outline/40"
                                        :class="
                                            isStepChecked(index, 0)
                                                ? 'bg-primary text-white border-primary'
                                                : ''
                                        "
                                        >{{ isStepChecked(index, 0) ? '✓' : '' }}</span
                                    >
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <span
                                        class="inline-flex h-5 w-5 items-center justify-center rounded border border-outline/40"
                                        :class="
                                            isStepChecked(index, 1)
                                                ? 'bg-primary text-white border-primary'
                                                : ''
                                        "
                                        >{{ isStepChecked(index, 1) ? '✓' : '' }}</span
                                    >
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <span
                                        class="inline-flex h-5 w-5 items-center justify-center rounded border border-outline/40"
                                        :class="
                                            isStepChecked(index, 2)
                                                ? 'bg-primary text-white border-primary'
                                                : ''
                                        "
                                        >{{ isStepChecked(index, 2) ? '✓' : '' }}</span
                                    >
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <span
                                        class="inline-flex rounded-md border px-3 py-1 text-xs font-semibold"
                                        :class="resolveStatusClass(row.status)"
                                        >{{ row.status }}</span
                                    >
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <button
                                        class="text-outline-variant hover:text-white"
                                        type="button"
                                        title="Ver"
                                        @click.stop="goToEditRequest(row.id)"
                                    >
                                        <span class="material-symbols-outlined text-[18px]"
                                            >visibility</span
                                        >
                                    </button>
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <button
                                        v-if="row.status === 'ASSIGNED'"
                                        class="text-primary hover:text-blue-200"
                                        type="button"
                                        title="Enviar a calidad"
                                        @click.stop="sendToQualityReview(row.id)"
                                    >
                                        <span class="material-symbols-outlined text-[18px]"
                                            >send</span
                                        >
                                    </button>
                                    <span v-else class="text-outline-variant/30">—</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </article>

            <div class="flex items-center justify-between">
                <h3 class="text-3xl font-semibold text-white">
                    Expediente de Solicitud:
                    <span class="text-amber-300">{{
                        selectedRow?.requestCode || 'SOL-0000-000'
                    }}</span>
                </h3>
                <AppButton
                    icon="print"
                    icon-position="left"
                    size="md"
                    variant="ghost"
                    @click="exportRequests"
                >
                    Imprimir Expediente
                </AppButton>
            </div>

            <section class="grid gap-4 xl:grid-cols-3">
                <article
                    class="rounded-xl border border-outline/20 bg-surface-container-lowest/5 p-4"
                >
                    <h4 class="mb-3 text-xs uppercase tracking-[0.12em] text-secondary-container">
                        Historial de Comentarios
                    </h4>
                    <ol class="relative space-y-3 pl-5">
                        <span
                            class="pointer-events-none absolute bottom-2 left-[7px] top-2 w-px bg-white/70"
                        />
                        <li class="relative">
                            <span
                                class="absolute -left-5 top-2 h-3 w-3 rounded-full bg-primary ring-2 ring-deep-navy"
                            />
                            <article
                                class="rounded-lg border border-outline/20 bg-surface-container-lowest/25 p-3 text-sm text-outline-variant"
                            >
                                <p class="font-semibold text-white">Ing. Carlos Ruiz</p>
                                <p
                                    class="text-[11px] uppercase tracking-[0.08em] text-primary-fixed-dim"
                                >
                                    24/05/2024 · 10:30 AM
                                </p>
                                <p class="mt-1">
                                    Revisión de material aprobada. Proceder con el arte final.
                                </p>
                            </article>
                        </li>
                        <li class="relative">
                            <span
                                class="absolute -left-5 top-2 h-3 w-3 rounded-full bg-white/70 ring-2 ring-deep-navy"
                            />
                            <article
                                class="rounded-lg border border-outline/20 bg-surface-container-lowest/25 p-3 text-sm text-outline-variant"
                            >
                                <p class="font-semibold text-white">Arq. Sofía Méndez</p>
                                <p
                                    class="text-[11px] uppercase tracking-[0.08em] text-primary-fixed-dim"
                                >
                                    23/05/2024 · 04:15 PM
                                </p>
                                <p class="mt-1">
                                    Se requiere confirmación del acabado para impresión.
                                </p>
                            </article>
                        </li>
                    </ol>
                </article>

                <article
                    class="rounded-xl border border-outline/20 bg-surface-container-lowest/5 p-4"
                >
                    <h4 class="mb-3 text-xs uppercase tracking-[0.12em] text-secondary-container">
                        Verificaciones de Calidad
                    </h4>
                    <ol class="relative space-y-3 pl-5">
                        <span
                            class="pointer-events-none absolute bottom-2 left-[7px] top-2 w-px bg-white/70"
                        />
                        <li class="relative">
                            <span
                                class="absolute -left-5 top-2 h-3 w-3 rounded-full bg-emerald-300 ring-2 ring-deep-navy"
                            />
                            <article
                                class="flex items-center justify-between rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-3.5 py-3 text-[0.95rem] text-emerald-200"
                            >
                                <span class="inline-flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[18px]"
                                        >straighten</span
                                    >
                                    <span>Validación de Medidas</span>
                                </span>
                                <span class="text-xs font-semibold uppercase tracking-[0.08em]"
                                    >Aprobado</span
                                >
                            </article>
                        </li>
                        <li class="relative">
                            <span
                                class="absolute -left-5 top-2 h-3 w-3 rounded-full bg-emerald-300 ring-2 ring-deep-navy"
                            />
                            <article
                                class="flex items-center justify-between rounded-lg border border-emerald-500/35 bg-emerald-500/10 px-3.5 py-3 text-[0.95rem] text-emerald-200"
                            >
                                <span class="inline-flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[18px]"
                                        >layers</span
                                    >
                                    <span>Gramaje de Sustrato</span>
                                </span>
                                <span class="text-xs font-semibold uppercase tracking-[0.08em]"
                                    >Aprobado</span
                                >
                            </article>
                        </li>
                        <li class="relative">
                            <span
                                class="absolute -left-5 top-2 h-3 w-3 rounded-full bg-amber-300 ring-2 ring-deep-navy"
                            />
                            <article
                                class="flex items-center justify-between rounded-lg border border-amber-500/35 bg-amber-500/10 px-3.5 py-3 text-[0.95rem] text-amber-200"
                            >
                                <span class="inline-flex items-center gap-2">
                                    <span class="material-symbols-outlined text-[18px]"
                                        >palette</span
                                    >
                                    <span>Prueba de Color CMYK</span>
                                </span>
                                <span class="text-xs font-semibold uppercase tracking-[0.08em]"
                                    >Pendiente</span
                                >
                            </article>
                        </li>
                    </ol>
                </article>

                <article
                    class="rounded-xl border border-outline/20 bg-surface-container-lowest/5 p-4"
                >
                    <h4 class="mb-3 text-xs uppercase tracking-[0.12em] text-secondary-container">
                        Trazabilidad del Proceso
                    </h4>
                    <ol class="space-y-5">
                        <li class="relative flex gap-3">
                            <div class="relative flex w-10 shrink-0 justify-center">
                                <span
                                    class="z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white"
                                    >1</span
                                >
                                <span class="absolute top-8 h-[56px] w-px bg-primary/30" />
                            </div>
                            <div class="pt-0.5">
                                <p class="font-semibold text-white">Solicitud Creada</p>
                                <p class="text-xs text-outline-variant">
                                    20/05/2024 - Sistema Central
                                </p>
                                <p class="mt-1 text-sm text-outline-variant">
                                    Ingreso manual por Depto. ventas.
                                </p>
                            </div>
                        </li>

                        <li class="relative flex gap-3">
                            <div class="relative flex w-10 shrink-0 justify-center">
                                <span
                                    class="z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white"
                                    >2</span
                                >
                                <span class="absolute top-8 h-[56px] w-px bg-primary/30" />
                            </div>
                            <div class="pt-0.5">
                                <p class="font-semibold text-white">Asignación a Diseño</p>
                                <p class="text-xs text-outline-variant">
                                    21/05/2024 - Ing. Carlos Ruiz
                                </p>
                                <p class="mt-1 text-sm text-outline-variant">
                                    Asignado a Equipo de Artes Finales.
                                </p>
                            </div>
                        </li>

                        <li class="relative flex gap-3">
                            <div class="relative flex w-10 shrink-0 justify-center">
                                <span
                                    class="z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-sm font-semibold text-white"
                                    >3</span
                                >
                            </div>
                            <div class="pt-0.5">
                                <p class="font-semibold text-white">En Desarrollo</p>
                                <p class="text-xs uppercase tracking-[0.08em] text-amber-300">
                                    Proceso actual
                                </p>
                                <p class="mt-1 text-sm text-outline-variant">
                                    Fase de maquetación y dummie físico.
                                </p>
                            </div>
                        </li>
                    </ol>
                </article>
            </section>

            <input
                ref="importInputRef"
                accept=".csv,.xlsx,.xls"
                class="hidden"
                type="file"
                @change="handleImportSelection"
            />
        </section>
    </AppShellLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'
import AppButton from '~/presentation/shared/components/ui/AppButton.vue'
import { useRequestsModule } from '~/presentation/requests/composables/useRequestsModule'
import { useApiClient } from '~/presentation/shared/composables/useApiClient'

defineOptions({
    name: 'DesignQueueView',
})

interface Designer {
    id: string
    fullName: string
    employeeCode: string
}

const router = useRouter()
const apiClient = useApiClient()
const {
    importInputRef,
    isJefe,
    isDisenador,
    draftRequests,
    inDesignRequests,
    highPriorityRequests,
    tableRows,
    myAssignedRows,
    sendToDesign,
    sendToQualityReview,
    assignDesigner,
    removeDesignerAssignment,
    triggerImport,
    handleImportSelection,
    exportRequests,
    hydrateRequests,
} = useRequestsModule()

const selectedRequestId = ref('')
const designers = ref<Designer[]>([])

const sourceRows = computed(() => (isDisenador.value ? myAssignedRows.value : tableRows.value))
const displayRows = computed(() => sourceRows.value.slice(0, 50))
const selectedRow = computed(() => {
    const match = displayRows.value.find((row) => row.id === selectedRequestId.value)
    return match ?? displayRows.value[0] ?? null
})

const getAvailableDesigners = (row: { assignedDesigners: { designerId: string }[] }) => {
    const assignedIds = new Set(row.assignedDesigners.map((a) => a.designerId))
    return designers.value.filter((d) => !assignedIds.has(d.id))
}

const onAssignDesigner = (requestId: string, event: Event) => {
    const select = event.target as HTMLSelectElement
    const designerId = select.value
    if (!designerId) return
    const designer = designers.value.find((d) => d.id === designerId)
    if (designer) {
        void assignDesigner(requestId, designer.id, designer.fullName)
        select.value = ''
    }
}

const onRemoveDesigner = (requestId: string, designerId: string) => {
    void removeDesignerAssignment(requestId, designerId)
}

const artsCount = computed(() => inDesignRequests.value)
const dummiesCount = computed(() => draftRequests.value)
const mechanicsCount = computed(() => highPriorityRequests.value)
const pendingQualityCount = computed(
    () => tableRows.value.filter((row) => row.status !== 'Aprobada').length,
)

const isStepChecked = (rowIndex: number, step: number) => rowIndex % 3 === step

const resolveStatusClass = (status: string) => {
    if (status === 'Aprobada') {
        return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
    }

    if (status === 'En diseño') {
        return 'border-amber-500/30 bg-amber-500/10 text-amber-200'
    }

    return 'border-outline/30 bg-surface-container-lowest/20 text-outline-variant'
}

const goToEditRequest = (requestId: string) => {
    void router.push(`/solicitudes/${requestId}/editar`)
}

onMounted(async () => {
    await hydrateRequests()

    const first = tableRows.value[0]
    if (first) {
        selectedRequestId.value = first.id
    }

    if (isJefe.value) {
        try {
            const response = await apiClient.get<Designer[]>('/users/designers')
            designers.value = response.data
        } catch {
            // designers list is non-critical, silently ignore
        }
    }
})

useHead(() => ({
    title: 'RUASA ERP - Bandeja Diseño',
    htmlAttrs: {
        lang: 'es',
    },
    bodyAttrs: {
        class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant',
    },
}))
</script>
