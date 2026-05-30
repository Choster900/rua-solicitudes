<template>
    <AppShellLayout screen-title="Solicitudes">
        <section class="mx-auto w-full max-w-6xl space-y-4">
            <button
                class="inline-flex items-center gap-1 rounded-lg border border-outline/30 px-3 py-2 text-sm text-outline-variant transition-colors hover:bg-surface-container-low/10 hover:text-white"
                type="button"
                @click="goBackToRequests"
            >
                <span class="material-symbols-outlined text-[18px]">arrow_back</span>
                Volver a solicitudes
            </button>

            <div class="grid gap-4 lg:grid-cols-[minmax(0,1fr),320px]">
                <RequestFormCard
                    mode="create"
                    :model="requestFormModel"
                    @cancel="goBackToRequests"
                    @submit="handleCreateRequest"
                />

                <aside class="space-y-4">
                    <article
                        class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 p-4"
                    >
                        <h3 class="text-sm font-semibold text-white">Checklist recomendado</h3>
                        <ul class="mt-3 space-y-2 text-sm text-outline-variant">
                            <li class="flex items-start gap-2">
                                <span
                                    class="material-symbols-outlined text-[18px] text-secondary-container"
                                    >task_alt</span
                                >
                                Definir material y técnica de impresión.
                            </li>
                            <li class="flex items-start gap-2">
                                <span
                                    class="material-symbols-outlined text-[18px] text-secondary-container"
                                    >task_alt</span
                                >
                                Adjuntar branding y archivos fuente (`.ia`/`.ai`).
                            </li>
                            <li class="flex items-start gap-2">
                                <span
                                    class="material-symbols-outlined text-[18px] text-secondary-container"
                                    >task_alt</span
                                >
                                Especificar entregables esperados.
                            </li>
                            <li class="flex items-start gap-2">
                                <span
                                    class="material-symbols-outlined text-[18px] text-secondary-container"
                                    >task_alt</span
                                >
                                Confirmar fecha de entrega realista.
                            </li>
                        </ul>
                    </article>
                    <article
                        class="rounded-2xl border border-outline/20 bg-surface-container-lowest/5 p-4"
                    >
                        <h3 class="text-sm font-semibold text-white">Impacto del brief</h3>
                        <p class="mt-2 text-sm text-outline-variant">
                            Un brief completo reduce retrabajo, mejora tiempos de aprobación y
                            acelera el paso a preprensa.
                        </p>
                    </article>
                </aside>
            </div>
        </section>
    </AppShellLayout>
</template>

<script setup lang="ts">
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'
import RequestFormCard from '~/presentation/requests/components/RequestFormCard.vue'
import {
    createEmptyRequestFormModel,
    useRequestsModule,
} from '~/presentation/requests/composables/useRequestsModule'
import type { DesignRequestFormModel } from '~/presentation/interfaces/requests/request-form.interface'

defineOptions({
    name: 'SolicitudCreateView',
})

const router = useRouter()
const { createRequest, hydrateRequests } = useRequestsModule()
const requestFormModel = createEmptyRequestFormModel()

const goBackToRequests = () => {
    void router.push('/solicitudes')
}

const handleCreateRequest = async (formModel: DesignRequestFormModel) => {
    const created = await createRequest(formModel)

    if (created) {
        goBackToRequests()
    }
}

onMounted(() => {
    void hydrateRequests()
})

useHead(() => ({
    title: 'RUASA ERP - Nueva Solicitud',
    htmlAttrs: {
        lang: 'es',
    },
    bodyAttrs: {
        class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant',
    },
}))
</script>
