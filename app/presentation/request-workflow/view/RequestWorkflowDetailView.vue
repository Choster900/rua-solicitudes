<template>
    <AppShellLayout screen-title="Detalle de Trámite">
        <section class="mx-auto w-full max-w-6xl space-y-4">
            <button
                class="inline-flex items-center gap-1 rounded-lg border border-outline/30 px-3 py-2 text-sm text-outline-variant transition-colors hover:bg-surface-container-low/10 hover:text-white"
                type="button"
                @click="goBack"
            >
                <span class="material-symbols-outlined text-[18px]">arrow_back</span>
                Volver a bandeja
            </button>

            <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr),320px]">
                <WorkflowDetailPanel
                    :checklist="requestChecklist"
                    :checklist-labels="checklistFieldLabels"
                    :request="selectedRequest"
                    :stage-label="
                        selectedRequest ? stageLabelMap[selectedRequest.stage] : 'Sin selección'
                    "
                    :stage-tone="selectedRequest ? stageToneMap[selectedRequest.stage] : 'neutral'"
                />

                <aside class="space-y-4">
                    <article
                        class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 p-4"
                    >
                        <h3 class="text-sm font-semibold text-white">Estado actual</h3>
                        <p class="mt-2 text-sm text-outline-variant">
                            {{
                                selectedRequest
                                    ? stageLabelMap[selectedRequest.stage]
                                    : 'Solicitud no encontrada'
                            }}
                        </p>
                        <p class="mt-1 text-xs text-outline-variant">
                            Última actualización:
                            {{ selectedRequest ? formatDate(selectedRequest.updatedAt) : '-' }}
                        </p>
                    </article>

                    <article
                        class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 p-4"
                    >
                        <h3 class="text-sm font-semibold text-white">Flujo operativo</h3>
                        <ul class="mt-3 space-y-2 text-xs text-outline-variant">
                            <li class="flex items-start gap-2">
                                <span
                                    class="material-symbols-outlined text-[17px] text-secondary-container"
                                    >check_circle</span
                                >
                                Diseño valida checklist obligatorio.
                            </li>
                            <li class="flex items-start gap-2">
                                <span
                                    class="material-symbols-outlined text-[17px] text-secondary-container"
                                    >check_circle</span
                                >
                                Calidad aprueba o rechaza con trazabilidad.
                            </li>
                            <li class="flex items-start gap-2">
                                <span
                                    class="material-symbols-outlined text-[17px] text-secondary-container"
                                    >check_circle</span
                                >
                                Rechazo vuelve automáticamente a Diseño.
                            </li>
                        </ul>
                    </article>
                </aside>
            </div>
        </section>
    </AppShellLayout>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import dayjs from 'dayjs'
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'
import WorkflowDetailPanel from '~/presentation/request-workflow/components/WorkflowDetailPanel.vue'
import { useRequestWorkflowModule } from '~/presentation/request-workflow/composables/useRequestWorkflowModule'

defineOptions({
    name: 'RequestWorkflowDetailView',
})

const route = useRoute()
const router = useRouter()

const { workflowStore, checklistFieldLabels, stageLabelMap, stageToneMap } =
    useRequestWorkflowModule()

const requestId = computed(() => String(route.params.requestId ?? ''))

const selectedRequest = computed(() => {
    if (!requestId.value) {
        return null
    }

    return workflowStore.requestById(requestId.value)
})

const requestChecklist = computed(() => {
    if (!selectedRequest.value) {
        return {
            briefValidated: false,
            technicalSpecsValidated: false,
            assetsValidated: false,
            legalValidated: false,
        }
    }

    return selectedRequest.value.checklist
})

const goBack = () => {
    if (!selectedRequest.value) {
        void router.push('/requests/design')
        return
    }

    if (['READY_FOR_QUALITY', 'QUALITY_IN_REVIEW'].includes(selectedRequest.value.stage)) {
        void router.push('/requests/quality')
        return
    }

    void router.push('/requests/design')
}

const formatDate = (sourceDate: string) => {
    const parsedDate = dayjs(sourceDate)

    if (!parsedDate.isValid()) {
        return 'Fecha inválida'
    }

    return new Intl.DateTimeFormat('es-SV', {
        dateStyle: 'medium',
        timeStyle: 'short',
    }).format(parsedDate.toDate())
}

onMounted(async () => {
    await workflowStore.hydrate()
})

useHead(() => ({
    title: 'RUASA ERP - Detalle de Trámite',
    htmlAttrs: {
        lang: 'es',
    },
    bodyAttrs: {
        class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant',
    },
}))
</script>
