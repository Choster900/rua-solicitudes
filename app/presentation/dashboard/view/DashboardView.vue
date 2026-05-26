<template>
    <AppShellLayout screen-title="Dashboard">
        <section class="space-y-5">
            <header class="pt-1">
                <h1
                    class="text-xl font-headline-md font-semibold uppercase tracking-[0.02em] text-white"
                >
                    Panel de Control
                </h1>
            </header>

            <section class="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <article
                    v-for="metric in metrics"
                    :key="metric.label"
                    class="relative overflow-hidden rounded-xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3"
                >
                    <span
                        class="pointer-events-none absolute bottom-0 left-0 top-0 w-[3px]"
                        :class="metric.accentClass"
                    />
                    <div class="flex items-center justify-between gap-4">
                        <p class="text-[11px] uppercase tracking-[0.12em] text-outline-variant">
                            {{ metric.label }}
                        </p>
                        <p class="text-4xl font-semibold leading-none text-white">
                            {{ metric.value }}
                        </p>
                    </div>
                </article>
            </section>

            <article
                class="overflow-hidden rounded-xl border border-outline/20 bg-surface-container-lowest/5"
            >
                <header class="border-b border-outline/20 px-4 py-3">
                    <h2
                        class="text-xl font-headline-md font-semibold uppercase tracking-[0.02em] text-white"
                    >
                        Actividad Reciente
                    </h2>
                </header>

                <div class="divide-y divide-outline/20">
                    <article
                        v-for="activity in recentActivities"
                        :key="activity.id"
                        class="grid items-center gap-3 px-4 py-3 lg:grid-cols-[minmax(0,1fr)_auto]"
                    >
                        <div
                            class="grid min-w-0 gap-3 sm:grid-cols-[auto_auto_1fr] sm:items-center"
                        >
                            <span class="material-symbols-outlined text-[18px] text-primary">
                                draw
                            </span>
                            <p class="text-sm text-outline-variant">
                                {{ activity.requestCode }}
                            </p>
                            <div class="min-w-0">
                                <p class="truncate text-sm text-white">
                                    {{ activity.clientName }}
                                </p>
                                <p class="truncate text-sm text-outline-variant">
                                    {{ activity.productName }}
                                </p>
                            </div>
                        </div>

                        <p class="text-sm uppercase tracking-[0.1em] text-primary-fixed">
                            {{ activity.stageLabel }}
                        </p>
                    </article>
                </div>
            </article>
        </section>
    </AppShellLayout>
</template>

<script setup lang="ts">
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'

defineOptions({
    name: 'DashboardView',
})

const metrics = [
    { label: 'Artes', value: 1, accentClass: 'bg-primary' },
    { label: 'Dummies', value: 1, accentClass: 'bg-amber-400' },
    { label: 'Mecanicos', value: 1, accentClass: 'bg-emerald-400' },
    { label: 'Pendientes Calidad', value: 1, accentClass: 'bg-fuchsia-400' },
]

const recentActivities = [
    {
        id: 'activity-1',
        requestCode: 'ARTE-123',
        clientName: 'PANADERIA BAN BAN',
        productName: 'CAJA #8 DIA DE LAS MADRES',
        stageLabel: 'EN DISEÑO',
    },
    {
        id: 'activity-2',
        requestCode: 'ARTE-123',
        clientName: 'PANADERIA BAN BAN',
        productName: 'CAJA #8 DIA DE LAS MADRES',
        stageLabel: 'EN DISEÑO',
    },
]

useHead(() => ({
    title: 'RUASA ERP - Dashboard Industrial',
    htmlAttrs: {
        lang: 'es',
    },
    bodyAttrs: {
        class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant',
    },
}))
</script>
