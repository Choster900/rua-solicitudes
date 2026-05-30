<template>
    <AppShellLayout screen-title="Dashboard">
        <section class="-my-6 -mr-6">
            <div class="grid min-h-0 grid-cols-1 gap-0 lg:min-h-[calc(100vh-64px)] lg:grid-cols-10">
                <!-- ── IZQUIERDA: filtros + lista ────────────────────────── -->
                <article
                    class="col-span-1 flex flex-col border-b border-outline/20 lg:col-span-6 lg:border-b-0 lg:border-r"
                >
                    <!-- Encabezado + filtros -->
                    <div class="shrink-0 space-y-2.5 border-b border-outline/20 px-4 py-3">
                        <div class="flex items-center justify-between gap-2">
                            <div>
                                <h1 class="text-sm font-semibold text-white">
                                    Listado de solicitudes
                                </h1>
                                <p class="text-[10px] text-outline-variant">
                                    {{ filteredRequests.length }} registro(s) encontrado(s)
                                </p>
                            </div>
                            <button
                                type="button"
                                class="flex items-center gap-1.5 rounded-lg border border-outline/25 bg-surface-container-low/20 px-3 py-1.5 text-xs text-slate-300 transition-colors hover:border-outline/40 hover:bg-surface-container-low/40 active:scale-95"
                                @click="printAll"
                            >
                                <span class="material-symbols-outlined text-[15px]">print</span>
                                Imprimir todo
                            </button>
                        </div>
                        <div class="flex flex-wrap items-center gap-2">
                            <div class="relative min-w-0 flex-1">
                                <span
                                    class="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-[15px] text-outline-variant"
                                >
                                    search
                                </span>
                                <input
                                    v-model="searchQuery"
                                    class="w-full rounded-lg border border-outline/20 bg-surface-container-low/20 py-1.5 pl-8 pr-3 text-xs text-slate-200 placeholder:text-outline-variant focus:border-primary/50 focus:outline-none"
                                    placeholder="Código, cliente o producto..."
                                />
                            </div>
                            <div class="w-full shrink-0 sm:w-[155px]">
                                <AppSelect
                                    v-model="statusFilter"
                                    compact
                                    :clearable="false"
                                    :input-class="'!py-[5px] !text-xs'"
                                    :options="statusOptions"
                                    :searchable="false"
                                />
                            </div>
                            <div class="w-full shrink-0 sm:w-[130px]">
                                <AppSelect
                                    v-model="priorityFilter"
                                    compact
                                    :clearable="false"
                                    :input-class="'!py-[5px] !text-xs'"
                                    :options="priorityOptions"
                                    :searchable="false"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Lista de solicitudes -->
                    <div
                        class="min-h-0 max-h-[45vh] flex-1 divide-y divide-outline/10 overflow-y-auto lg:max-h-none"
                    >
                        <div
                            v-if="isLoading"
                            class="flex items-center justify-center gap-2 py-12 text-xs text-outline-variant"
                        >
                            <span class="material-symbols-outlined animate-spin text-[18px]">
                                progress_activity
                            </span>
                            Cargando solicitudes...
                        </div>

                        <div
                            v-else-if="!filteredRequests.length"
                            class="py-12 text-center text-xs text-outline-variant"
                        >
                            Sin solicitudes para mostrar.
                        </div>

                        <button
                            v-for="req in filteredRequests"
                            :key="req.id"
                            type="button"
                            class="w-full border-l-2 px-4 py-3 text-left transition-colors hover:bg-surface-container-low/10"
                            :class="
                                selectedId === req.id
                                    ? 'border-l-primary bg-primary-container/10'
                                    : 'border-l-transparent'
                            "
                            @click="selectedId = req.id"
                        >
                            <div class="flex items-start gap-3">
                                <div class="min-w-0 flex-1">
                                    <!-- Código + versión + estado -->
                                    <div class="flex flex-wrap items-center gap-1.5">
                                        <span
                                            class="font-mono text-[11px] font-semibold text-primary-fixed-dim"
                                        >
                                            {{ req.requestCode }}
                                        </span>
                                        <span
                                            class="rounded bg-primary/15 px-1 py-0.5 font-mono text-[9px] text-primary-fixed-dim"
                                        >
                                            v{{ req.versionNumber }}
                                        </span>
                                        <span
                                            class="rounded border px-1.5 py-0.5 text-[9px] font-semibold"
                                            :class="resolveStatusClass(req.status)"
                                        >
                                            {{ resolveStatusLabel(req.status) }}
                                        </span>
                                    </div>

                                    <!-- Cliente -->
                                    <p class="mt-0.5 truncate text-sm font-semibold text-slate-100">
                                        {{ req.clientName }}
                                    </p>

                                    <!-- Producto -->
                                    <p class="truncate text-[11px] text-slate-400">
                                        {{ req.productName || req.title }}
                                    </p>

                                    <!-- Meta info -->
                                    <div
                                        class="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-0.5"
                                    >
                                        <span
                                            class="flex items-center gap-1 text-[10px] text-outline-variant"
                                        >
                                            <span class="material-symbols-outlined text-[11px]"
                                                >person</span
                                            >
                                            {{ req.requestedBy }}
                                        </span>
                                        <span
                                            v-if="req.requiredDate"
                                            class="flex items-center gap-1 text-[10px] text-outline-variant"
                                        >
                                            <span class="material-symbols-outlined text-[11px]"
                                                >calendar_today</span
                                            >
                                            {{ formatDate(req.requiredDate) }}
                                        </span>
                                        <span
                                            v-if="req.assignedDesigners.length"
                                            class="flex items-center gap-1 text-[10px] text-blue-300"
                                        >
                                            <span class="material-symbols-outlined text-[11px]"
                                                >brush</span
                                            >
                                            {{
                                                req.assignedDesigners
                                                    .map((d) => d.designerName)
                                                    .join(', ')
                                            }}
                                        </span>
                                    </div>
                                </div>

                                <!-- Prioridad + checklist dots -->
                                <div class="flex shrink-0 flex-col items-end gap-2 pt-0.5">
                                    <span
                                        class="rounded border px-1.5 py-0.5 text-[9px] font-semibold"
                                        :class="resolvePriorityClass(req.priority)"
                                    >
                                        {{ req.priority }}
                                    </span>
                                    <div
                                        class="flex items-center gap-0.5"
                                        title="Arte / Mecánico / Dummy"
                                    >
                                        <span
                                            class="h-1.5 w-1.5 rounded-full"
                                            :class="
                                                req.artCompleted
                                                    ? 'bg-emerald-400'
                                                    : 'bg-outline/25'
                                            "
                                        />
                                        <span
                                            class="h-1.5 w-1.5 rounded-full"
                                            :class="
                                                req.mechanicalCompleted
                                                    ? 'bg-emerald-400'
                                                    : 'bg-outline/25'
                                            "
                                        />
                                        <span
                                            class="h-1.5 w-1.5 rounded-full"
                                            :class="
                                                req.dummyCompleted
                                                    ? 'bg-emerald-400'
                                                    : 'bg-outline/25'
                                            "
                                        />
                                    </div>
                                </div>
                            </div>
                        </button>
                    </div>
                </article>

                <!-- ── DERECHA: Panel de detalle ───────────────────────────── -->
                <aside
                    class="col-span-1 flex flex-col overflow-hidden border-t border-outline/20 bg-surface-container-low/15 lg:col-span-4 lg:border-l lg:border-t-0"
                >
                    <!-- Vacío -->
                    <div
                        v-if="!selected"
                        class="flex flex-1 flex-col items-center justify-center gap-3 text-center"
                    >
                        <span class="material-symbols-outlined text-5xl text-outline-variant/30">
                            assignment
                        </span>
                        <p class="text-xs text-outline-variant">
                            Selecciona una solicitud para ver el detalle completo
                        </p>
                    </div>

                    <template v-else>
                        <!-- Barra de acciones -->
                        <div
                            class="flex shrink-0 items-center justify-between gap-2 border-b border-outline/20 px-3 py-2.5"
                        >
                            <span
                                class="rounded border px-2 py-0.5 text-[10px] font-semibold"
                                :class="resolveStatusClass(selected.status)"
                            >
                                {{ resolveStatusLabel(selected.status) }}
                            </span>
                            <div class="flex items-center gap-1.5">
                                <span
                                    class="rounded border px-2 py-0.5 text-[10px] font-semibold"
                                    :class="resolvePriorityClass(selected.priority)"
                                >
                                    {{ selected.priority }}
                                </span>
                                <span
                                    class="rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-primary-fixed-dim"
                                >
                                    v{{ selected.versionNumber }}
                                </span>
                            </div>
                        </div>

                        <!-- Identidad -->
                        <div class="shrink-0 border-b border-outline/20 px-3 py-3">
                            <p class="font-mono text-[11px] text-primary-fixed-dim/70">
                                {{ selected.requestCode }}
                            </p>
                            <p class="mt-0.5 truncate text-base font-semibold text-slate-100">
                                {{ selected.clientName }}
                            </p>
                            <p class="truncate text-xs text-slate-400">
                                {{ selected.title || selected.productName }}
                            </p>
                        </div>

                        <!-- Checklist -->
                        <div class="shrink-0 border-b border-outline/20 px-3 py-3">
                            <p
                                class="mb-2 text-[0.6rem] font-semibold uppercase tracking-wider text-primary-fixed-dim"
                            >
                                Checklist de diseño
                            </p>
                            <div class="flex gap-4">
                                <div
                                    v-for="item in checklistItems"
                                    :key="item.key"
                                    class="flex items-center gap-1.5"
                                >
                                    <span
                                        class="material-symbols-outlined text-[15px]"
                                        :class="
                                            item.done ? 'text-emerald-400' : 'text-outline-variant'
                                        "
                                    >
                                        {{ item.done ? 'check_circle' : 'radio_button_unchecked' }}
                                    </span>
                                    <span
                                        class="text-[11px]"
                                        :class="
                                            item.done ? 'text-emerald-300' : 'text-outline-variant'
                                        "
                                    >
                                        {{ item.label }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Scroll del detalle -->
                        <div class="min-h-0 flex-1 overflow-y-auto">
                            <!-- Información general -->
                            <div class="border-b border-outline/20 px-3 py-3">
                                <p
                                    class="mb-2 text-[0.6rem] font-semibold uppercase tracking-wider text-primary-fixed-dim"
                                >
                                    Información
                                </p>
                                <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                    <div v-if="selected.productName">
                                        <p class="text-[0.6rem] uppercase text-outline-variant">
                                            Producto
                                        </p>
                                        <p class="text-slate-200">
                                            {{ selected.productName }}
                                        </p>
                                    </div>
                                    <div v-if="selected.brandName">
                                        <p class="text-[0.6rem] uppercase text-outline-variant">
                                            Marca
                                        </p>
                                        <p class="text-slate-200">
                                            {{ selected.brandName }}
                                        </p>
                                    </div>
                                    <div>
                                        <p class="text-[0.6rem] uppercase text-outline-variant">
                                            Solicitado por
                                        </p>
                                        <p class="text-slate-200">
                                            {{ selected.requestedBy }}
                                        </p>
                                    </div>
                                    <div>
                                        <p class="text-[0.6rem] uppercase text-outline-variant">
                                            Fecha de creación
                                        </p>
                                        <p class="text-slate-200">
                                            {{ formatDate(selected.createdAt) }}
                                        </p>
                                    </div>
                                    <div v-if="selected.requiredDate">
                                        <p class="text-[0.6rem] uppercase text-outline-variant">
                                            Entrega solicitada
                                        </p>
                                        <p class="text-slate-200">
                                            {{ formatDate(selected.requiredDate) }}
                                        </p>
                                    </div>
                                    <div v-if="selected.requireDieCut || selected.requireMockup">
                                        <p class="text-[0.6rem] uppercase text-outline-variant">
                                            Requerimientos
                                        </p>
                                        <div class="mt-0.5 flex flex-wrap gap-1">
                                            <span
                                                v-if="selected.requireDieCut"
                                                class="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] text-amber-300"
                                            >
                                                Troquel
                                            </span>
                                            <span
                                                v-if="selected.requireMockup"
                                                class="rounded border border-blue-500/30 bg-blue-500/10 px-1.5 py-0.5 text-[9px] text-blue-300"
                                            >
                                                Maqueta
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Especificaciones técnicas -->
                            <div v-if="hasSpecs" class="border-b border-outline/20 px-3 py-3">
                                <p
                                    class="mb-2 text-[0.6rem] font-semibold uppercase tracking-wider text-primary-fixed-dim"
                                >
                                    Especificaciones técnicas
                                </p>
                                <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                                    <div v-if="selected.dimensions">
                                        <p class="text-[0.6rem] uppercase text-outline-variant">
                                            Dimensiones
                                        </p>
                                        <p class="font-mono text-slate-200">
                                            {{ selected.dimensions }}
                                        </p>
                                    </div>
                                    <div v-if="selected.quantity">
                                        <p class="text-[0.6rem] uppercase text-outline-variant">
                                            Cantidad
                                        </p>
                                        <p class="text-slate-200">
                                            {{ selected.quantity.toLocaleString('es-SV') }}
                                        </p>
                                    </div>
                                    <div v-if="selected.materialType">
                                        <p class="text-[0.6rem] uppercase text-outline-variant">
                                            Material
                                        </p>
                                        <p class="text-slate-200">
                                            {{ selected.materialType }}
                                        </p>
                                    </div>
                                    <div v-if="selected.closureType">
                                        <p class="text-[0.6rem] uppercase text-outline-variant">
                                            Cierre
                                        </p>
                                        <p class="text-slate-200">
                                            {{ selected.closureType }}
                                        </p>
                                    </div>
                                    <div v-if="selected.fluteType">
                                        <p class="text-[0.6rem] uppercase text-outline-variant">
                                            Flauta
                                        </p>
                                        <p class="text-slate-200">
                                            {{ selected.fluteType }} {{ selected.fluteDirection }}
                                        </p>
                                    </div>
                                    <div v-if="selected.colorMode">
                                        <p class="text-[0.6rem] uppercase text-outline-variant">
                                            Modo de color
                                        </p>
                                        <p class="text-slate-200">
                                            {{ selected.colorMode }}
                                        </p>
                                    </div>
                                    <div v-if="selected.outerLiner">
                                        <p class="text-[0.6rem] uppercase text-outline-variant">
                                            Liner exterior
                                        </p>
                                        <p class="text-slate-200">
                                            {{ selected.outerLiner }}
                                        </p>
                                    </div>
                                    <div v-if="selected.innerLiner">
                                        <p class="text-[0.6rem] uppercase text-outline-variant">
                                            Liner interior
                                        </p>
                                        <p class="text-slate-200">
                                            {{ selected.innerLiner }}
                                        </p>
                                    </div>
                                    <div v-if="selected.pantoneReferences" class="col-span-2">
                                        <p class="text-[0.6rem] uppercase text-outline-variant">
                                            Referencias Pantone
                                        </p>
                                        <p class="text-slate-200">
                                            {{ selected.pantoneReferences }}
                                        </p>
                                    </div>
                                </div>
                                <div v-if="selected.finishingOptions?.length" class="mt-2">
                                    <p class="text-[0.6rem] uppercase text-outline-variant">
                                        Acabados
                                    </p>
                                    <div class="mt-1 flex flex-wrap gap-1">
                                        <span
                                            v-for="opt in selected.finishingOptions"
                                            :key="opt"
                                            class="rounded border border-outline/25 bg-surface-container-low/20 px-1.5 py-0.5 text-[9px] text-slate-300"
                                        >
                                            {{ opt }}
                                        </span>
                                    </div>
                                </div>
                                <div v-if="selected.deliverables?.length" class="mt-2">
                                    <p class="text-[0.6rem] uppercase text-outline-variant">
                                        Entregables
                                    </p>
                                    <div class="mt-1 flex flex-wrap gap-1">
                                        <span
                                            v-for="d in selected.deliverables"
                                            :key="d"
                                            class="rounded border border-outline/25 bg-surface-container-low/20 px-1.5 py-0.5 text-[9px] text-slate-300"
                                        >
                                            {{ d }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Instrucciones de diseño -->
                            <div
                                v-if="selected.designInstructions"
                                class="border-b border-outline/20 px-3 py-3"
                            >
                                <p
                                    class="mb-1.5 text-[0.6rem] font-semibold uppercase tracking-wider text-primary-fixed-dim"
                                >
                                    Instrucciones de diseño
                                </p>
                                <p class="text-xs leading-relaxed text-slate-300">
                                    {{ selected.designInstructions }}
                                </p>
                            </div>

                            <!-- Diseñadores asignados -->
                            <div
                                v-if="selected.assignedDesigners.length"
                                class="border-b border-outline/20 px-3 py-3"
                            >
                                <p
                                    class="mb-2 text-[0.6rem] font-semibold uppercase tracking-wider text-primary-fixed-dim"
                                >
                                    Diseñadores asignados
                                </p>
                                <div class="flex flex-wrap gap-1.5">
                                    <span
                                        v-for="d in selected.assignedDesigners"
                                        :key="d.designerId"
                                        class="flex items-center gap-1 rounded-full border border-blue-400/30 bg-blue-400/10 px-2 py-0.5 text-[10px] text-blue-300"
                                    >
                                        <span class="material-symbols-outlined text-[11px]"
                                            >brush</span
                                        >
                                        {{ d.designerName }}
                                    </span>
                                </div>
                            </div>

                            <!-- Archivos del vendedor -->
                            <div
                                v-if="selected.sampleFiles?.length"
                                class="border-b border-outline/20 px-3 py-3"
                            >
                                <p
                                    class="mb-2 text-[0.6rem] font-semibold uppercase tracking-wider text-primary-fixed-dim"
                                >
                                    Archivos del vendedor
                                    <span
                                        class="ml-1 rounded-full bg-primary/20 px-1.5 py-0.5 text-[9px] text-primary-fixed-dim"
                                    >
                                        {{ selected.sampleFiles.length }}
                                    </span>
                                </p>
                                <div class="grid grid-cols-3 gap-2">
                                    <a
                                        v-for="f in selected.sampleFiles"
                                        :key="f.id"
                                        :href="'data:' + f.mimeType + ';base64,' + f.base64Content"
                                        target="_blank"
                                        rel="noopener"
                                        class="group block"
                                    >
                                        <img
                                            v-if="f.mimeType.startsWith('image/')"
                                            :src="
                                                'data:' + f.mimeType + ';base64,' + f.base64Content
                                            "
                                            :alt="f.originalName"
                                            class="h-20 w-full rounded-lg border border-outline/20 object-cover transition-opacity group-hover:opacity-80"
                                        />
                                        <div
                                            v-else
                                            class="flex h-20 flex-col items-center justify-center gap-1 rounded-lg border border-outline/20 bg-surface-container-low/20 px-2 transition-colors group-hover:bg-surface-container-low/30"
                                        >
                                            <span
                                                class="material-symbols-outlined text-[20px] text-outline-variant"
                                                >attach_file</span
                                            >
                                            <span
                                                class="line-clamp-2 text-center text-[9px] text-outline-variant"
                                                >{{ f.originalName }}</span
                                            >
                                        </div>
                                        <p
                                            v-if="f.notes"
                                            class="mt-0.5 truncate text-[9px] italic text-outline-variant"
                                        >
                                            {{ f.notes }}
                                        </p>
                                    </a>
                                </div>
                            </div>

                            <!-- Historial de revisiones de calidad -->
                            <div
                                v-if="selected.qualityHistory?.length"
                                class="border-b border-outline/20 px-3 py-3"
                            >
                                <p
                                    class="mb-2 text-[0.6rem] font-semibold uppercase tracking-wider text-primary-fixed-dim"
                                >
                                    Historial de calidad
                                    <span
                                        class="ml-1 rounded-full bg-purple-400/20 px-1.5 py-0.5 text-[9px] text-purple-300"
                                    >
                                        {{ selected.qualityHistory.length }}
                                    </span>
                                </p>
                                <div class="space-y-2">
                                    <div
                                        v-for="qr in selected.qualityHistory"
                                        :key="qr.id"
                                        class="rounded-lg border px-2.5 py-2 text-xs"
                                        :class="
                                            qr.decision === 'APPROVED'
                                                ? 'border-emerald-500/25 bg-emerald-500/5'
                                                : 'border-red-400/25 bg-red-400/5'
                                        "
                                    >
                                        <div class="flex items-center justify-between gap-2">
                                            <div class="flex items-center gap-1.5">
                                                <span
                                                    class="rounded border px-1.5 py-0.5 text-[9px] font-semibold"
                                                    :class="
                                                        qr.decision === 'APPROVED'
                                                            ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
                                                            : 'border-red-400/40 bg-red-400/10 text-red-300'
                                                    "
                                                >
                                                    {{
                                                        qr.decision === 'APPROVED'
                                                            ? 'Aprobado'
                                                            : 'Rechazado'
                                                    }}
                                                </span>
                                                <span
                                                    class="rounded bg-primary/15 px-1 py-0.5 font-mono text-[9px] text-primary-fixed-dim"
                                                >
                                                    v{{ qr.versionNumber }}
                                                </span>
                                            </div>
                                            <span class="text-[9px] text-outline-variant">
                                                {{ formatDate(qr.reviewedAt) }}
                                            </span>
                                        </div>
                                        <p class="mt-1 text-[10px] text-slate-400">
                                            {{ qr.reviewedBy }}
                                        </p>
                                        <p
                                            v-if="qr.generalObservations"
                                            class="mt-1.5 leading-relaxed text-slate-300"
                                        >
                                            {{ qr.generalObservations }}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <!-- Archivos del diseñador -->
                            <div
                                v-if="selected.attachments?.length"
                                class="border-b border-outline/20 px-3 py-3"
                            >
                                <p
                                    class="mb-2 text-[0.6rem] font-semibold uppercase tracking-wider text-primary-fixed-dim"
                                >
                                    Archivos del diseñador
                                    <span
                                        class="ml-1 rounded-full bg-blue-400/20 px-1.5 py-0.5 text-[9px] text-blue-300"
                                    >
                                        {{ selected.attachments.length }}
                                    </span>
                                </p>
                                <div class="grid grid-cols-3 gap-2">
                                    <a
                                        v-for="f in selected.attachments"
                                        :key="f.id"
                                        :href="'data:' + f.mimeType + ';base64,' + f.base64Content"
                                        target="_blank"
                                        rel="noopener"
                                        class="group block"
                                    >
                                        <img
                                            v-if="f.mimeType.startsWith('image/')"
                                            :src="
                                                'data:' + f.mimeType + ';base64,' + f.base64Content
                                            "
                                            :alt="f.originalName"
                                            class="h-20 w-full rounded-lg border border-blue-400/20 object-cover transition-opacity group-hover:opacity-80"
                                        />
                                        <div
                                            v-else
                                            class="flex h-20 flex-col items-center justify-center gap-1 rounded-lg border border-blue-400/20 bg-blue-400/5 px-2 transition-colors group-hover:bg-blue-400/10"
                                        >
                                            <span
                                                class="material-symbols-outlined text-[20px] text-blue-300/50"
                                                >attach_file</span
                                            >
                                            <span
                                                class="line-clamp-2 text-center text-[9px] text-outline-variant"
                                                >{{ f.originalName }}</span
                                            >
                                        </div>
                                        <p
                                            v-if="f.notes"
                                            class="mt-0.5 truncate text-[9px] italic text-outline-variant"
                                        >
                                            {{ f.notes }}
                                        </p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </template>
                </aside>
            </div>
        </section>
    </AppShellLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'
import AppSelect, { type AppSelectOption } from '~/presentation/shared/components/ui/AppSelect.vue'
import { useApiClient } from '~/presentation/shared/composables/useApiClient'
import {
    REQUEST_STATUS_LABELS,
    type DesignRequest,
    type RequestStatus,
} from '~/presentation/interfaces/requests/request.interface'

defineOptions({ name: 'DashboardView' })

const apiClient = useApiClient()
const allRequests = ref<DesignRequest[]>([])
const isLoading = ref(false)
const selectedId = ref<string>('')
const searchQuery = ref('')
const statusFilter = ref<string>('all')
const priorityFilter = ref<string>('all')

const findRequestById = (id: string) => allRequests.value.find((r) => r.id === id) ?? null

// ─── Imprimir ─────────────────────────────────────────────────────────────────

const printAll = () => {
    const rows = filteredRequests.value
    if (!rows.length) return

    const fmt = (iso: string | null) =>
        iso ? new Intl.DateTimeFormat('es-SV', { dateStyle: 'short' }).format(new Date(iso)) : '—'

    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

    const check = (v: boolean) =>
        v
            ? '<span style="color:#16a34a;font-weight:bold;">✓</span>'
            : '<span style="color:#d1d5db;">—</span>'

    const tbody = rows
        .map((req) => {
            const designers = req.assignedDesigners.length
                ? req.assignedDesigners.map((d) => esc(d.designerName)).join(', ')
                : '—'

            const obs = req.qualityHistory?.length
                ? req.qualityHistory
                      .filter((qr) => qr.generalObservations)
                      .map(
                          (qr) =>
                              `<span style="color:${qr.decision === 'APPROVED' ? '#15803d' : '#b91c1c'};">[v${qr.versionNumber} ${qr.decision === 'APPROVED' ? '✓' : '✗'}]</span> ${esc(qr.generalObservations)}`,
                      )
                      .join('<br>')
                : '—'

            return `<tr>
                <td><b>${esc(req.requestCode)}</b><br><small style="color:#6b7280;">v${req.versionNumber}</small></td>
                <td>${fmt(req.createdAt)}</td>
                <td>${esc(req.clientName)}</td>
                <td>${esc(req.productName || req.title)}</td>
                <td style="text-align:center;">${check(req.artCompleted)}</td>
                <td style="text-align:center;">${check(req.mechanicalCompleted)}</td>
                <td style="text-align:center;">${check(req.dummyCompleted)}</td>
                <td><span style="font-size:8px;">${esc(resolveStatusLabel(req.status))}</span></td>
                <td>${esc(req.requestedBy)}</td>
                <td>${designers}</td>
                <td style="font-size:8px;color:#374151;">${obs}</td>
            </tr>`
        })
        .join('')

    const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Solicitudes de Diseño</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: Arial, sans-serif; font-size: 9px; color: #111; padding: 10mm; }
  header { margin-bottom: 6mm; }
  header h1 { font-size: 14px; font-weight: bold; }
  header p { font-size: 9px; color: #6b7280; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  colgroup col:nth-child(1)  { width: 8%; }
  colgroup col:nth-child(2)  { width: 6%; }
  colgroup col:nth-child(3)  { width: 10%; }
  colgroup col:nth-child(4)  { width: 10%; }
  colgroup col:nth-child(5)  { width: 3%; }
  colgroup col:nth-child(6)  { width: 3%; }
  colgroup col:nth-child(7)  { width: 3%; }
  colgroup col:nth-child(8)  { width: 9%; }
  colgroup col:nth-child(9)  { width: 10%; }
  colgroup col:nth-child(10) { width: 10%; }
  colgroup col:nth-child(11) { width: 28%; }
  thead tr { background: #1e3a5f; color: #fff; }
  thead th { padding: 5px 4px; text-align: left; font-size: 8px; font-weight: bold; letter-spacing: 0.04em; }
  thead th.center { text-align: center; }
  tbody tr:nth-child(even) { background: #f8fafc; }
  tbody tr:nth-child(odd)  { background: #ffffff; }
  tbody tr { border-bottom: 1px solid #e2e8f0; page-break-inside: avoid; }
  td { padding: 4px; vertical-align: top; word-break: break-word; }
  @page { size: A4 landscape; margin: 8mm 10mm; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
<header>
  <h1>Solicitudes de Diseño</h1>
  <p>Generado el ${new Date().toLocaleDateString('es-SV', { dateStyle: 'long' })} · ${rows.length} solicitud(es)</p>
</header>
<table>
  <colgroup>
    <col/><col/><col/><col/><col/><col/><col/><col/><col/><col/><col/>
  </colgroup>
  <thead>
    <tr>
      <th>Código</th>
      <th>Fecha</th>
      <th>Cliente</th>
      <th>Producto</th>
      <th class="center">A</th>
      <th class="center">M</th>
      <th class="center">D</th>
      <th>Estado</th>
      <th>Vendedor</th>
      <th>Diseñador(es)</th>
      <th>Observaciones de calidad</th>
    </tr>
  </thead>
  <tbody>${tbody}</tbody>
</table>
</body>
</html>`

    const win = window.open('', '_blank', 'width=1200,height=800')
    if (!win) return
    win.document.write(html)
    win.document.close()
    win.focus()
    setTimeout(() => win.print(), 300)
}

// ─── Opciones de filtro ────────────────────────────────────────────────────────

const statusOptions: AppSelectOption[] = [
    { label: 'Todos los estados', value: 'all' },
    ...Object.entries(REQUEST_STATUS_LABELS).map(([value, label]) => ({ label, value })),
]

const priorityOptions: AppSelectOption[] = [
    { label: 'Toda prioridad', value: 'all' },
    { label: 'Urgente', value: 'URGENT' },
    { label: 'Alta', value: 'HIGH' },
    { label: 'Media', value: 'MEDIUM' },
    { label: 'Baja', value: 'LOW' },
]

// ─── Solicitudes filtradas ─────────────────────────────────────────────────────

const filteredRequests = computed(() => {
    let list = allRequests.value

    if (searchQuery.value.trim()) {
        const q = searchQuery.value.trim().toLowerCase()
        list = list.filter(
            (r) =>
                r.requestCode.toLowerCase().includes(q) ||
                r.clientName.toLowerCase().includes(q) ||
                r.productName.toLowerCase().includes(q) ||
                r.title.toLowerCase().includes(q),
        )
    }

    if (statusFilter.value !== 'all') {
        list = list.filter((r) => r.status === statusFilter.value)
    }

    if (priorityFilter.value !== 'all') {
        list = list.filter((r) => r.priority === priorityFilter.value)
    }

    return list
})

// ─── Selección ────────────────────────────────────────────────────────────────

const selected = computed<DesignRequest | null>(() => findRequestById(selectedId.value))

watch(
    filteredRequests,
    (list) => {
        if (!list.some((r) => r.id === selectedId.value)) {
            selectedId.value = list.at(0)?.id ?? ''
        }
    },
    { immediate: true },
)

// ─── Detalle ──────────────────────────────────────────────────────────────────

const checklistItems = computed(() => {
    if (!selected.value) return []
    return [
        { key: 'art', label: 'Arte', done: selected.value.artCompleted },
        { key: 'mechanical', label: 'Mecánico', done: selected.value.mechanicalCompleted },
        { key: 'dummy', label: 'Dummy', done: selected.value.dummyCompleted },
    ]
})

const hasSpecs = computed(() => {
    const s = selected.value
    if (!s) return false
    return !!(
        s.dimensions ||
        s.quantity ||
        s.materialType ||
        s.colorMode ||
        s.closureType ||
        s.fluteType ||
        s.outerLiner ||
        s.innerLiner ||
        s.pantoneReferences ||
        s.finishingOptions?.length ||
        s.deliverables?.length
    )
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_CLASSES: Record<string, string> = {
    CREATED: 'border-outline/40 text-outline-variant',
    PENDING_DESIGN_REVIEW: 'border-yellow-500/40 bg-yellow-500/10 text-yellow-300',
    ASSIGNED_TO_DESIGNER: 'border-blue-400/40 bg-blue-400/10 text-blue-300',
    IN_DESIGN: 'border-primary/40 bg-primary/10 text-primary-fixed-dim',
    SENT_TO_QUALITY: 'border-purple-400/40 bg-purple-400/10 text-purple-300',
    QUALITY_REJECTED: 'border-red-400/40 bg-red-400/10 text-red-300',
    QUALITY_APPROVED: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300',
    DELIVERED_TO_SALES: 'border-teal-400/40 bg-teal-400/10 text-teal-300',
    CANCELLED: 'border-outline/30 bg-outline/5 text-outline-variant',
}

const PRIORITY_CLASSES: Record<string, string> = {
    URGENT: 'border-red-500/40 bg-red-500/10 text-red-300',
    HIGH: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    MEDIUM: 'border-blue-400/40 bg-blue-400/10 text-blue-300',
    LOW: 'border-outline/40 text-outline-variant',
}

const resolveStatusClass = (status: string) =>
    STATUS_CLASSES[status] ?? 'border-outline/40 text-outline-variant'
const resolvePriorityClass = (priority: string) =>
    PRIORITY_CLASSES[priority] ?? 'border-outline/40 text-outline-variant'
const resolveStatusLabel = (status: string) =>
    REQUEST_STATUS_LABELS[status as RequestStatus] ?? status

const formatDate = (iso: string | null) => {
    if (!iso) return '—'
    return new Intl.DateTimeFormat('es-SV', { dateStyle: 'short' }).format(new Date(iso))
}

// ─── Inicialización ───────────────────────────────────────────────────────────

onMounted(async () => {
    isLoading.value = true
    try {
        const res = await apiClient.get<DesignRequest[]>('/requests/all')
        allRequests.value = res.data
    } catch (error) {
        console.error('[Dashboard] Error cargando solicitudes:', error)
    } finally {
        isLoading.value = false
    }
})

useHead(() => ({
    title: 'RUASA ERP - Dashboard',
    htmlAttrs: { lang: 'es' },
    bodyAttrs: {
        class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant',
    },
}))
</script>
