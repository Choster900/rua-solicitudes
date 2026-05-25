<template>
    <AppShellLayout screen-title="Bandeja Calidad">
        <section class="grid min-h-[calc(100vh-112px)] grid-cols-1 gap-0 xl:grid-cols-[70%_30%]">
            <div class="space-y-4 pr-0 xl:pr-5">
                <header class="flex items-start justify-between gap-4">
                    <div>
                        <h1 class="text-4xl font-semibold leading-tight text-white">
                            Bandeja de Revisiones Técnicas
                        </h1>
                        <p class="mt-1 max-w-xl text-2xl text-outline-variant">
                            Validación de artes y especificaciones industriales.
                        </p>
                    </div>

                    <button
                        class="inline-flex items-center gap-2 rounded-lg border border-outline/30 bg-surface-container-low/30 px-4 py-2 text-sm text-white transition-colors hover:bg-surface-container-low/45"
                        type="button"
                    >
                        <span class="material-symbols-outlined text-[17px]">filter_list</span>
                        Filtrar
                    </button>
                </header>

                <article
                    class="overflow-hidden rounded-xl border border-outline/20 bg-surface-container-lowest/5"
                >
                    <header
                        class="grid grid-cols-[24%_32%_18%_26%] border-b border-outline/20 bg-surface-container-low/20 px-4 py-2 text-xs uppercase tracking-[0.12em] text-secondary-container"
                    >
                        <p>ID Solicitud</p>
                        <p>Cliente / Producto</p>
                        <p>Estado</p>
                        <p>Acciones</p>
                    </header>

                    <section class="border-l-2 border-primary">
                        <div
                            class="grid grid-cols-[24%_32%_18%_26%] items-center border-b border-outline/15 px-4 py-4"
                        >
                            <p class="text-2xl font-semibold text-primary-fixed">SOL-2026-042</p>
                            <div class="text-white">
                                <p class="text-4xl">BAN BAN</p>
                                <p class="text-3xl leading-tight text-outline-variant">
                                    CAJA DIA DE LA MADRE
                                </p>
                                <p class="text-2xl text-outline-variant">#8 2027</p>
                            </div>
                            <div>
                                <span
                                    class="inline-flex rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-amber-200"
                                >
                                    Pendiente
                                </span>
                            </div>
                            <div class="flex justify-end">
                                <button class="text-primary hover:text-white" type="button">
                                    <span class="material-symbols-outlined text-[20px]"
                                        >expand_more</span
                                    >
                                </button>
                            </div>
                        </div>

                        <div
                            class="grid gap-4 border-b border-outline/15 px-4 py-4 lg:grid-cols-[40%_60%]"
                        >
                            <div>
                                <h3
                                    class="mb-3 text-xs uppercase tracking-[0.12em] text-secondary-container"
                                >
                                    Checklist de Validación
                                </h3>
                                <div
                                    class="space-y-2 rounded-lg border border-outline/15 bg-surface-container-lowest/20 p-2.5"
                                >
                                    <div
                                        v-for="item in validationChecklist"
                                        :key="item.label"
                                        class="flex items-center justify-between rounded-md bg-surface-container-low/30 px-2.5 py-2"
                                    >
                                        <p
                                            class="inline-flex items-center gap-2 text-xl text-white"
                                        >
                                            <span
                                                class="inline-block h-2.5 w-2.5 rounded-full"
                                                :class="item.dotClass"
                                            />
                                            {{ item.label }}
                                        </p>
                                        <span
                                            class="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
                                            :class="item.statusClass"
                                        >
                                            {{ item.status }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3
                                    class="mb-3 text-xs uppercase tracking-[0.12em] text-secondary-container"
                                >
                                    Observaciones Técnicas
                                </h3>
                                <textarea
                                    class="h-[128px] w-full rounded-lg border border-outline/25 bg-surface-container-low/35 px-3 py-2 text-sm text-white outline-none placeholder:text-outline-variant focus:border-primary/60"
                                    placeholder="Añadir comentarios específicos para los puntos de validación..."
                                />
                                <div class="mt-3 flex flex-wrap justify-end gap-2">
                                    <button
                                        class="inline-flex items-center gap-2 rounded-full border border-red-500/35 bg-red-600/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white"
                                        type="button"
                                    >
                                        <span class="material-symbols-outlined text-[16px]"
                                            >do_not_disturb_on</span
                                        >
                                        Rechazar con observaciones
                                    </button>
                                    <button
                                        class="inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-white"
                                        type="button"
                                    >
                                        <span class="material-symbols-outlined text-[16px]"
                                            >task_alt</span
                                        >
                                        Aprobar revisión
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-[24%_32%_18%_26%] items-center px-4 py-4">
                            <p class="text-2xl font-semibold text-primary-fixed">SOL-2026-045</p>
                            <div class="text-white">
                                <p class="text-4xl">AMERICAN TEXTILES</p>
                                <p class="text-3xl leading-tight text-outline-variant">
                                    CAJA XXXX000000 2027
                                </p>
                            </div>
                            <div>
                                <span
                                    class="inline-flex rounded-md border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-primary-fixed-dim"
                                >
                                    En proceso
                                </span>
                            </div>
                            <div class="flex justify-end">
                                <button class="text-outline-variant hover:text-white" type="button">
                                    <span class="material-symbols-outlined text-[20px]"
                                        >chevron_right</span
                                    >
                                </button>
                            </div>
                        </div>
                    </section>
                </article>
            </div>

            <aside
                class="flex h-full flex-col overflow-hidden rounded-xl border border-outline/20 bg-surface-container-low/35"
            >
                <header class="border-b border-outline/20 px-4 py-4">
                    <h2 class="inline-flex items-center gap-2 text-3xl font-semibold text-white">
                        <span class="material-symbols-outlined text-[18px] text-primary"
                            >confirmation_number</span
                        >
                        Centro de Casos Consultados
                    </h2>
                    <p class="mt-1 text-sm text-outline-variant">
                        Tickets de preventa y factibilidad técnica.
                    </p>
                </header>

                <div class="flex-1 space-y-1 overflow-y-auto px-0 py-0">
                    <article
                        v-for="(ticket, index) in consultedCases"
                        :key="ticket.code"
                        class="border-l-2 px-4 py-4 transition-colors"
                        :class="
                            index === 0
                                ? 'border-primary bg-primary/10'
                                : 'border-transparent hover:bg-surface-container-lowest/20'
                        "
                    >
                        <div class="flex items-start justify-between gap-2">
                            <p class="text-sm font-semibold tracking-[0.04em] text-primary-fixed">
                                {{ ticket.code }}
                            </p>
                            <span
                                class="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
                                :class="ticket.statusClass"
                            >
                                {{ ticket.status }}
                            </span>
                        </div>
                        <p class="mt-2 text-2xl leading-tight text-white">{{ ticket.title }}</p>
                        <div
                            class="mt-2 flex items-center justify-between text-xs text-outline-variant"
                        >
                            <p class="inline-flex items-center gap-1">
                                <span class="material-symbols-outlined text-[14px]">person</span>
                                {{ ticket.owner }}
                            </p>
                            <p class="uppercase tracking-[0.08em]">{{ ticket.area }}</p>
                        </div>
                    </article>
                </div>

                <footer class="border-t border-outline/20 p-4">
                    <button
                        class="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-outline/25 bg-surface-container-lowest/20 px-4 py-2.5 text-sm text-white transition-colors hover:bg-surface-container-lowest/35"
                        type="button"
                    >
                        <span class="material-symbols-outlined text-[16px]">history</span>
                        Ver Historial de Casos
                    </button>
                </footer>
            </aside>
        </section>
    </AppShellLayout>
</template>

<script setup lang="ts">
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'

defineOptions({
    name: 'CalidadView',
})

const validationChecklist = [
    {
        label: 'Validación de Medidas',
        status: 'OK',
        dotClass: 'bg-emerald-400',
        statusClass: 'bg-emerald-500/20 text-emerald-200',
    },
    {
        label: 'Gramaje de Sustrato',
        status: 'OK',
        dotClass: 'bg-emerald-400',
        statusClass: 'bg-emerald-500/20 text-emerald-200',
    },
    {
        label: 'Verificación de Dummie',
        status: 'Revisando',
        dotClass: 'bg-amber-300',
        statusClass: 'bg-amber-500/20 text-amber-200',
    },
    {
        label: 'Verificación de Mecánico',
        status: 'Ajuste req.',
        dotClass: 'bg-rose-400',
        statusClass: 'bg-rose-500/20 text-rose-200',
    },
    {
        label: 'Prueba de Color',
        status: 'Revisando',
        dotClass: 'bg-amber-300',
        statusClass: 'bg-amber-500/20 text-amber-200',
    },
    {
        label: 'Datos Generales',
        status: 'OK',
        dotClass: 'bg-emerald-400',
        statusClass: 'bg-emerald-500/20 text-emerald-200',
    },
]

const consultedCases = [
    {
        code: 'CASE-2024-992',
        title: 'CAJA DE BIMBO',
        owner: 'Andrés Méndez',
        area: 'Producción',
        status: 'Abierto',
        statusClass: 'bg-primary/20 text-primary-fixed',
    },
    {
        code: 'CASE-2024-988',
        title: 'DESARROLLO DE LA CONSTANCIA',
        owner: 'Laura Ortiz',
        area: 'Materiales',
        status: 'Urgente',
        statusClass: 'bg-amber-500/20 text-amber-200',
    },
    {
        code: 'CASE-2024-981',
        title: 'CAJA SANCHIA',
        owner: 'Andrés Méndez',
        area: 'Diseño',
        status: 'Resuelto',
        statusClass: 'bg-emerald-500/20 text-emerald-200',
    },
]

useHead(() => ({
    title: 'RUASA ERP - Calidad',
    htmlAttrs: {
        lang: 'es',
    },
    bodyAttrs: {
        class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant',
    },
}))
</script>
