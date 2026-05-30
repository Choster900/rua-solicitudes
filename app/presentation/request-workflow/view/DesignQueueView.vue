<template>
    <AppShellLayout screen-title="Bandeja Diseño">
        <section class="grid h-full gap-0 xl:grid-cols-[minmax(0,70%),minmax(0,30%)]">
            <!-- ── Lista ─────────────────────────────────────────────── -->
            <article class="flex min-h-0 flex-col border-r border-outline/20">
                <!-- Stats -->
                <div
                    class="grid grid-cols-2 gap-3 border-b border-outline/20 px-4 py-3 md:grid-cols-4"
                >
                    <div
                        class="rounded-xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3"
                    >
                        <p class="text-xs uppercase tracking-[0.12em] text-outline-variant">
                            Sin asignar
                        </p>
                        <p class="mt-1 text-3xl font-semibold text-white">{{ unassignedCount }}</p>
                    </div>
                    <div
                        class="rounded-xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3"
                    >
                        <p class="text-xs uppercase tracking-[0.12em] text-outline-variant">
                            En diseño
                        </p>
                        <p class="mt-1 text-3xl font-semibold text-white">{{ inDesignCount }}</p>
                    </div>
                    <div
                        class="rounded-xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3"
                    >
                        <p class="text-xs uppercase tracking-[0.12em] text-outline-variant">
                            En calidad
                        </p>
                        <p class="mt-1 text-3xl font-semibold text-white">{{ inQualityCount }}</p>
                    </div>
                    <div
                        class="rounded-xl border border-outline/20 bg-surface-container-lowest/5 px-4 py-3"
                    >
                        <p class="text-xs uppercase tracking-[0.12em] text-outline-variant">
                            Alta prioridad
                        </p>
                        <p class="mt-1 text-3xl font-semibold text-white">
                            {{ highPriorityRequests }}
                        </p>
                    </div>
                </div>

                <!-- Status filter tabs -->
                <div
                    class="flex gap-1 overflow-x-auto border-b border-outline/20 px-4 pt-3 pb-0 scrollbar-hide"
                >
                    <button
                        v-for="tab in statusTabs"
                        :key="tab.key"
                        :class="[
                            'flex shrink-0 items-center gap-1.5 rounded-t-lg px-3 py-2 text-xs font-semibold uppercase tracking-widest transition-colors',
                            tab.key === 'QUALITY_REJECTED'
                                ? activeFilter === tab.key
                                    ? 'border-b-2 border-red-400 text-red-300'
                                    : tab.count > 0
                                      ? 'text-red-400 hover:text-red-300'
                                      : 'text-outline-variant hover:text-red-400'
                                : activeFilter === tab.key
                                  ? 'border-b-2 border-primary text-primary'
                                  : 'text-outline-variant hover:text-white',
                        ]"
                        type="button"
                        @click="activeFilter = tab.key"
                    >
                        {{ tab.label }}
                        <span
                            class="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                            :class="
                                tab.key === 'QUALITY_REJECTED'
                                    ? activeFilter === tab.key
                                        ? 'bg-red-400/20 text-red-300'
                                        : tab.count > 0
                                          ? 'bg-red-400/20 text-red-400'
                                          : 'bg-outline/20 text-outline-variant'
                                    : activeFilter === tab.key
                                      ? 'bg-primary/20 text-primary'
                                      : 'bg-outline/20 text-outline-variant'
                            "
                            >{{ tab.count }}</span
                        >
                    </button>
                </div>

                <!-- Table header -->
                <header
                    class="flex items-center justify-between border-b border-outline/20 px-4 py-2"
                >
                    <p class="text-xs text-outline-variant">
                        {{ filteredRows.length }} solicitudes
                    </p>
                </header>

                <!-- Table -->
                <div class="flex-1 overflow-auto">
                    <table class="min-w-full">
                        <thead class="sticky top-0 z-10 bg-[#0B1E30]">
                            <tr
                                class="border-b border-outline/20 text-left text-xs uppercase tracking-[0.08em] text-outline-variant"
                            >
                                <th class="px-4 py-3">Solicitud</th>
                                <th class="px-4 py-3">Cliente</th>
                                <th class="px-4 py-3">Producto</th>
                                <th class="px-4 py-3">Diseñador</th>
                                <th class="px-4 py-3 text-center">Arte</th>
                                <th class="px-4 py-3 text-center">Mecánico</th>
                                <th class="px-4 py-3 text-center">Dummie</th>
                                <th class="px-4 py-3 text-center">Estado</th>
                                <th class="px-4 py-3 text-center">Prioridad</th>
                                <th class="px-4 py-3 text-center">Acciones</th>
                            </tr>
                        </thead>

                        <tbody>
                            <tr
                                v-for="row in filteredRows"
                                :key="row.id"
                                class="cursor-pointer border-b border-outline/15 transition-colors hover:bg-surface-container-low/10"
                                :class="
                                    selectedRequestId === row.id
                                        ? 'bg-primary/10 hover:bg-primary/15'
                                        : ''
                                "
                                @click="selectedRequestId = row.id"
                            >
                                <td class="px-4 py-3">
                                    <p class="text-sm font-semibold text-white">
                                        {{ row.requestCode }}
                                    </p>
                                    <span
                                        class="mt-0.5 inline-block rounded bg-primary/15 px-1.5 py-0.5 font-mono text-[10px] text-primary-fixed-dim"
                                    >
                                        v{{ row.versionNumber }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-sm text-outline-variant">
                                    {{ row.clientName }}
                                </td>
                                <td class="px-4 py-3 text-sm text-outline-variant">
                                    {{ row.productName }}
                                </td>
                                <td class="px-4 py-3 text-sm" @click.stop>
                                    <div
                                        v-if="row.assignedDesigners.length"
                                        class="flex flex-wrap gap-1"
                                    >
                                        <span
                                            v-for="a in row.assignedDesigners"
                                            :key="a.designerId"
                                            class="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[11px] text-primary-fixed-dim"
                                        >
                                            {{ a.designerName }}
                                            <button
                                                v-if="isJefe"
                                                type="button"
                                                class="leading-none text-outline-variant hover:text-red-400"
                                                title="Quitar asignación"
                                                @click.stop="onRemoveDesigner(row.id, a.designerId)"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    </div>
                                    <span v-else class="text-xs text-outline-variant/50"
                                        >Sin asignar</span
                                    >
                                </td>
                                <!-- Arte -->
                                <td class="px-4 py-3 text-center" @click.stop>
                                    <button
                                        v-if="canToggleChecklist(row)"
                                        class="inline-flex items-center justify-center transition-colors"
                                        :class="
                                            getChecklist(row.id).artCompleted
                                                ? 'text-emerald-400 hover:text-emerald-300'
                                                : 'text-outline-variant hover:text-white'
                                        "
                                        type="button"
                                        title="Alternar Arte"
                                        @click="handleToggleChecklist(row.id, 'art')"
                                    >
                                        <span class="material-symbols-outlined text-[22px]">
                                            {{
                                                getChecklist(row.id).artCompleted
                                                    ? 'check_box'
                                                    : 'check_box_outline_blank'
                                            }}
                                        </span>
                                    </button>
                                    <span
                                        v-else
                                        :class="
                                            getChecklist(row.id).artCompleted
                                                ? 'text-emerald-400'
                                                : 'text-outline-variant/30'
                                        "
                                        class="text-sm"
                                    >
                                        {{ getChecklist(row.id).artCompleted ? '✓' : '—' }}
                                    </span>
                                </td>

                                <!-- Mecánico -->
                                <td class="px-4 py-3 text-center" @click.stop>
                                    <button
                                        v-if="canToggleChecklist(row)"
                                        class="inline-flex items-center justify-center transition-colors"
                                        :class="
                                            getChecklist(row.id).mechanicalCompleted
                                                ? 'text-emerald-400 hover:text-emerald-300'
                                                : 'text-outline-variant hover:text-white'
                                        "
                                        type="button"
                                        title="Alternar Mecánico"
                                        @click="handleToggleChecklist(row.id, 'mechanical')"
                                    >
                                        <span class="material-symbols-outlined text-[22px]">
                                            {{
                                                getChecklist(row.id).mechanicalCompleted
                                                    ? 'check_box'
                                                    : 'check_box_outline_blank'
                                            }}
                                        </span>
                                    </button>
                                    <span
                                        v-else
                                        :class="
                                            getChecklist(row.id).mechanicalCompleted
                                                ? 'text-emerald-400'
                                                : 'text-outline-variant/30'
                                        "
                                        class="text-sm"
                                    >
                                        {{ getChecklist(row.id).mechanicalCompleted ? '✓' : '—' }}
                                    </span>
                                </td>

                                <!-- Dummie -->
                                <td class="px-4 py-3 text-center" @click.stop>
                                    <button
                                        v-if="canToggleChecklist(row)"
                                        class="inline-flex items-center justify-center transition-colors"
                                        :class="
                                            getChecklist(row.id).dummyCompleted
                                                ? 'text-emerald-400 hover:text-emerald-300'
                                                : 'text-outline-variant hover:text-white'
                                        "
                                        type="button"
                                        title="Alternar Dummie"
                                        @click="handleToggleChecklist(row.id, 'dummy')"
                                    >
                                        <span class="material-symbols-outlined text-[22px]">
                                            {{
                                                getChecklist(row.id).dummyCompleted
                                                    ? 'check_box'
                                                    : 'check_box_outline_blank'
                                            }}
                                        </span>
                                    </button>
                                    <span
                                        v-else
                                        :class="
                                            getChecklist(row.id).dummyCompleted
                                                ? 'text-emerald-400'
                                                : 'text-outline-variant/30'
                                        "
                                        class="text-sm"
                                    >
                                        {{ getChecklist(row.id).dummyCompleted ? '✓' : '—' }}
                                    </span>
                                </td>

                                <td class="px-4 py-3 text-center">
                                    <span
                                        class="inline-flex rounded-md border px-2.5 py-0.5 text-xs font-semibold"
                                        :class="resolveStatusClass(row.status)"
                                        >{{ resolveStatusLabel(row.status) }}</span
                                    >
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <span
                                        class="inline-flex rounded-md border px-2.5 py-0.5 text-xs font-semibold"
                                        :class="resolvePriorityClass(row.priority)"
                                        >{{ resolvePriorityLabel(row.priority) }}</span
                                    >
                                </td>
                                <td class="px-4 py-3 text-center" @click.stop>
                                    <div class="flex items-center justify-center gap-1">
                                        <!-- Asignar / Reasignar (solo jefe) -->
                                        <button
                                            v-if="isJefe && isAssignable(row.status)"
                                            class="inline-flex items-center gap-1 rounded-md border border-sky-500/40 bg-sky-500/10 px-2 py-1 text-xs text-sky-300 transition-colors hover:bg-sky-500/20"
                                            type="button"
                                            :title="
                                                row.assignedDesigners.length
                                                    ? 'Reasignar diseñador'
                                                    : 'Asignar diseñador'
                                            "
                                            @click="openAssignModal(row.id)"
                                        >
                                            <span class="material-symbols-outlined text-[14px]"
                                                >person_add</span
                                            >
                                            {{
                                                row.assignedDesigners.length
                                                    ? 'Reasignar'
                                                    : 'Asignar'
                                            }}
                                        </button>

                                        <!-- Enviar a calidad (diseñador o jefe) -->
                                        <button
                                            v-if="canSendToQuality(row)"
                                            :disabled="!allChecklistCompleted(row.id)"
                                            class="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors"
                                            :class="
                                                allChecklistCompleted(row.id)
                                                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                                                    : 'cursor-not-allowed border-outline/20 bg-outline/5 text-outline-variant/40'
                                            "
                                            type="button"
                                            :title="
                                                allChecklistCompleted(row.id)
                                                    ? 'Enviar a calidad'
                                                    : 'Completa Arte, Mecánico y Dummie para habilitar'
                                            "
                                            @click="sendToQualityReview(row.id)"
                                        >
                                            <span class="material-symbols-outlined text-[14px]"
                                                >send</span
                                            >
                                            Calidad
                                        </button>

                                        <!-- Ver detalle -->
                                        <button
                                            class="inline-flex h-7 w-7 items-center justify-center rounded-md border border-outline/30 text-outline-variant transition-colors hover:border-white/30 hover:text-white"
                                            type="button"
                                            title="Ver detalle"
                                            @click="goToEditRequest(row.id)"
                                        >
                                            <span class="material-symbols-outlined text-[15px]"
                                                >visibility</span
                                            >
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            <tr v-if="!filteredRows.length">
                                <td
                                    colspan="7"
                                    class="px-4 py-12 text-center text-sm text-outline-variant"
                                >
                                    No hay solicitudes para el filtro seleccionado.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </article>

            <!-- ── Expediente Histórico ──────────────────────────────── -->
            <aside
                class="-mr-6 -my-6 flex h-[calc(100%+3rem)] flex-col self-stretch border-l border-outline/20 bg-surface-container-lowest/5"
            >
                <header class="border-b border-outline/20 px-4 py-4">
                    <h2 class="text-xl font-semibold text-slate-200">Expediente Histórico</h2>
                    <div class="mt-2 grid gap-1.5">
                        <div class="flex items-center gap-2">
                            <p
                                class="inline-flex w-fit rounded bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary-fixed-dim"
                            >
                                {{ selectedRow?.requestCode || 'SOL-0000-000' }}
                            </p>
                            <span
                                v-if="selectedRow"
                                class="inline-flex rounded bg-secondary-container/20 px-2 py-0.5 font-mono text-xs text-secondary-container"
                            >
                                v{{ selectedRow.versionNumber }}
                            </span>
                        </div>
                        <p class="text-base text-slate-300">
                            {{ selectedRow?.clientName || 'Selecciona una solicitud' }}
                        </p>
                    </div>
                </header>

                <div class="min-h-0 flex-1 space-y-4 overflow-auto px-4 py-4">
                    <!-- Estado y prioridad -->
                    <section v-if="selectedRow">
                        <div class="flex flex-wrap gap-2">
                            <span
                                class="inline-flex rounded-md border px-3 py-1 text-xs font-semibold"
                                :class="resolveStatusClass(selectedRow.status)"
                            >
                                {{ resolveStatusLabel(selectedRow.status) }}
                            </span>
                            <span
                                class="inline-flex rounded-md border px-3 py-1 text-xs font-semibold"
                                :class="resolvePriorityClass(selectedRow.priority)"
                            >
                                {{ resolvePriorityLabel(selectedRow.priority) }}
                            </span>
                        </div>
                    </section>

                    <!-- Detalles -->
                    <section v-if="selectedRow" class="border-t border-outline/20 pt-3">
                        <h3
                            class="mb-2 text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                        >
                            Detalles
                        </h3>
                        <div class="grid gap-2 text-sm">
                            <div v-if="selectedRequest?.title">
                                <p class="text-[10px] uppercase text-outline-variant">Título</p>
                                <p class="text-slate-200">{{ selectedRequest.title }}</p>
                            </div>
                            <div v-if="selectedRow.productName && selectedRow.productName !== '—'">
                                <p class="text-[10px] uppercase text-outline-variant">Producto</p>
                                <p class="text-slate-200">{{ selectedRow.productName }}</p>
                            </div>
                            <div v-if="selectedRow.requestedBy">
                                <p class="text-[10px] uppercase text-outline-variant">
                                    Solicitado por
                                </p>
                                <p class="text-slate-200">{{ selectedRow.requestedBy }}</p>
                            </div>
                            <div
                                v-if="
                                    selectedRow.requiredDateLabel &&
                                    selectedRow.requiredDateLabel !== '—'
                                "
                            >
                                <p class="text-[10px] uppercase text-outline-variant">
                                    Entrega solicitada
                                </p>
                                <p class="text-slate-200">{{ selectedRow.requiredDateLabel }}</p>
                            </div>
                        </div>
                    </section>

                    <!-- Especificaciones técnicas -->
                    <section v-if="selectedRequest" class="border-t border-outline/20 pt-3">
                        <h3
                            class="mb-2 text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                        >
                            Especificaciones
                        </h3>
                        <div class="grid gap-2 text-sm">
                            <div v-if="selectedRequest.materialType">
                                <p class="text-[10px] uppercase text-outline-variant">
                                    Material / Flauta
                                </p>
                                <p class="text-slate-200">
                                    {{ selectedRequest.materialType }} —
                                    {{ selectedRequest.fluteType || '—' }}
                                </p>
                            </div>
                            <div v-if="selectedRequest.closureType">
                                <p class="text-[10px] uppercase text-outline-variant">
                                    Tipo de cierre
                                </p>
                                <p class="text-slate-200">{{ selectedRequest.closureType }}</p>
                            </div>
                            <div v-if="selectedRequest.colorMode">
                                <p class="text-[10px] uppercase text-outline-variant">Color</p>
                                <p class="text-slate-200">
                                    {{ selectedRequest.colorMode }}
                                    <span v-if="selectedRequest.pantoneReferences">
                                        — {{ selectedRequest.pantoneReferences }}</span
                                    >
                                </p>
                            </div>
                            <div
                                v-if="
                                    selectedRequest.length ||
                                    selectedRequest.width ||
                                    selectedRequest.height
                                "
                            >
                                <p class="text-[10px] uppercase text-outline-variant">Medidas</p>
                                <p class="text-slate-200">
                                    {{ selectedRequest.length || '?' }} ×
                                    {{ selectedRequest.width || '?' }} ×
                                    {{ selectedRequest.height || '?' }}
                                    {{ selectedRequest.dimensionUnit }}
                                </p>
                            </div>
                            <div v-if="selectedRequest.quantity">
                                <p class="text-[10px] uppercase text-outline-variant">Cantidad</p>
                                <p class="text-slate-200">
                                    {{ selectedRequest.quantity.toLocaleString('es-SV') }} unidades
                                </p>
                            </div>
                            <div v-if="selectedRequest.finishingOptions?.length">
                                <p class="text-[10px] uppercase text-outline-variant">Acabados</p>
                                <p class="text-slate-200">
                                    {{ selectedRequest.finishingOptions.join(', ') }}
                                </p>
                            </div>
                        </div>
                    </section>

                    <!-- Diseñadores asignados -->
                    <section v-if="selectedRow" class="border-t border-outline/20 pt-3">
                        <h3
                            class="mb-2 text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                        >
                            Diseñadores asignados
                        </h3>
                        <div
                            v-if="!selectedRow.assignedDesigners.length"
                            class="text-xs text-outline-variant"
                        >
                            Sin asignar
                        </div>
                        <ul v-else class="space-y-1">
                            <li
                                v-for="d in selectedRow.assignedDesigners"
                                :key="d.designerId"
                                class="flex items-center gap-2 text-sm text-slate-200"
                            >
                                <span
                                    class="material-symbols-outlined text-[15px] text-primary-fixed-dim"
                                    >design_services</span
                                >
                                {{ d.designerName }}
                            </li>
                        </ul>
                        <button
                            v-if="isJefe && selectedRow && isAssignable(selectedRow.status)"
                            class="mt-2 inline-flex items-center gap-1.5 rounded-md border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-xs text-sky-300 transition-colors hover:bg-sky-500/20"
                            type="button"
                            @click="openAssignModal(selectedRow.id)"
                        >
                            <span class="material-symbols-outlined text-[14px]">person_add</span>
                            {{
                                selectedRow.assignedDesigners.length
                                    ? 'Reasignar diseñador'
                                    : 'Asignar diseñador'
                            }}
                        </button>
                    </section>

                    <!-- Entregables -->
                    <section v-if="selectedRequest" class="border-t border-outline/20 pt-3">
                        <h3
                            class="mb-2 text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                        >
                            Entregables
                        </h3>
                        <div class="grid gap-1.5 text-xs">
                            <p
                                class="flex items-center justify-between border-b border-outline/20 pb-1"
                                :class="
                                    selectedRequest.requireMockup
                                        ? 'text-emerald-200'
                                        : 'text-outline-variant'
                                "
                            >
                                <span>Dummie / Mockup</span>
                                <span>{{ selectedRequest.requireMockup ? '✓' : '—' }}</span>
                            </p>
                            <p
                                class="flex items-center justify-between"
                                :class="
                                    selectedRequest.requireDieCut
                                        ? 'text-emerald-200'
                                        : 'text-outline-variant'
                                "
                            >
                                <span>Mecánico / Troquel</span>
                                <span>{{ selectedRequest.requireDieCut ? '✓' : '—' }}</span>
                            </p>
                        </div>
                    </section>

                    <!-- Instrucciones -->
                    <section
                        v-if="selectedRequest?.designInstructions"
                        class="border-t border-outline/20 pt-3"
                    >
                        <h3
                            class="mb-2 text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                        >
                            Instrucciones
                        </h3>
                        <p class="text-sm text-slate-300">
                            {{ selectedRequest.designInstructions }}
                        </p>
                    </section>

                    <!-- Historial de revisiones de calidad -->
                    <section
                        v-if="selectedRequest?.qualityHistory?.length"
                        class="border-t border-outline/20 pt-3"
                    >
                        <h3
                            class="mb-2 text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                        >
                            Historial de calidad
                            <span
                                class="ml-1 rounded-full bg-purple-400/20 px-1.5 py-0.5 text-[9px] text-purple-300"
                            >
                                {{ selectedRequest.qualityHistory.length }}
                            </span>
                        </h3>
                        <div class="space-y-2">
                            <div
                                v-for="qr in selectedRequest.qualityHistory"
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
                                        {{
                                            new Intl.DateTimeFormat('es-SV', {
                                                dateStyle: 'short',
                                            }).format(new Date(qr.reviewedAt))
                                        }}
                                    </span>
                                </div>
                                <p class="mt-1 text-[10px] text-slate-400">{{ qr.reviewedBy }}</p>
                                <p
                                    v-if="qr.generalObservations"
                                    class="mt-1.5 leading-relaxed text-slate-300"
                                >
                                    {{ qr.generalObservations }}
                                </p>
                            </div>
                        </div>
                    </section>

                    <!-- Archivos del vendedor -->
                    <section
                        v-if="selectedRequest?.sampleFiles?.length"
                        class="border-t border-outline/20 pt-3"
                    >
                        <h3
                            class="mb-2 text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                        >
                            Archivos del vendedor ({{ selectedRequest.sampleFiles.length }})
                        </h3>
                        <ul class="space-y-2">
                            <li
                                v-for="f in selectedRequest.sampleFiles"
                                :key="f.id"
                                class="overflow-hidden rounded-md border border-outline/20"
                            >
                                <img
                                    v-if="f.mimeType.startsWith('image/')"
                                    :src="`data:${f.mimeType};base64,${f.base64Content}`"
                                    :alt="f.originalName"
                                    class="w-full object-contain max-h-48 bg-black/20"
                                />
                                <div
                                    class="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-300"
                                >
                                    <span
                                        class="material-symbols-outlined text-[14px] text-primary-fixed-dim"
                                        >attach_file</span
                                    >
                                    <span class="truncate">{{ f.originalName }}</span>
                                    <span class="ml-auto shrink-0 text-outline-variant"
                                        >{{ Math.round(f.sizeBytes / 1024) }} KB</span
                                    >
                                </div>
                            </li>
                        </ul>
                    </section>

                    <!-- Archivos del diseñador -->
                    <section
                        v-if="selectedRow && (isJefe || isDisenador)"
                        class="border-t border-outline/20 pt-3"
                    >
                        <div class="mb-2 flex items-center justify-between">
                            <h3
                                class="text-[11px] uppercase tracking-[0.12em] text-secondary-container"
                            >
                                Archivos del diseñador
                                <span v-if="selectedRequest?.attachments?.length"
                                    >({{ selectedRequest.attachments.length }})</span
                                >
                            </h3>
                            <button
                                type="button"
                                :disabled="isUploadingAttachment"
                                class="inline-flex items-center gap-1 rounded-md border border-primary/40 bg-primary/10 px-2 py-0.5 text-[11px] text-primary-fixed-dim transition-colors hover:bg-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
                                @click="triggerAttachmentUpload"
                            >
                                <span class="material-symbols-outlined text-[13px]">
                                    {{ isUploadingAttachment ? 'progress_activity' : 'upload' }}
                                </span>
                                {{ isUploadingAttachment ? 'Subiendo…' : 'Subir' }}
                            </button>
                        </div>
                        <ul v-if="selectedRequest?.attachments?.length" class="space-y-2">
                            <li
                                v-for="f in selectedRequest.attachments"
                                :key="f.id"
                                class="overflow-hidden rounded-md border border-outline/20"
                            >
                                <img
                                    v-if="f.mimeType.startsWith('image/')"
                                    :src="`data:${f.mimeType};base64,${f.base64Content}`"
                                    :alt="f.originalName"
                                    class="w-full object-contain max-h-48 bg-black/20"
                                />
                                <div
                                    class="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-300"
                                >
                                    <span
                                        class="material-symbols-outlined text-[14px] text-secondary-container"
                                        >design_services</span
                                    >
                                    <span class="truncate">{{ f.originalName }}</span>
                                    <span class="ml-auto shrink-0 text-outline-variant"
                                        >{{ Math.round(f.sizeBytes / 1024) }} KB</span
                                    >
                                </div>
                            </li>
                        </ul>
                        <p v-else class="text-xs text-outline-variant">Sin archivos aún.</p>
                    </section>

                    <!-- Placeholder vacío -->
                    <div
                        v-if="!selectedRow"
                        class="flex flex-col items-center justify-center py-12 text-center"
                    >
                        <span class="material-symbols-outlined text-3xl text-outline-variant"
                            >article</span
                        >
                        <p class="mt-2 text-xs text-outline-variant">
                            Selecciona una solicitud para ver su expediente.
                        </p>
                    </div>
                </div>

                <footer class="grid grid-cols-2 gap-2 border-t border-outline/20 px-4 py-3">
                    <AppButton
                        size="md"
                        variant="ghost"
                        :disabled="!selectedRow"
                        @click="goToEditRequest(selectedRow?.id ?? '')"
                    >
                        Ver detalle
                    </AppButton>
                    <AppButton size="md" variant="ghost" @click="exportRequests">
                        Exportar
                    </AppButton>
                </footer>
            </aside>
        </section>

        <!-- Modales -->
        <input
            ref="importInputRef"
            accept=".csv,.xlsx,.xls"
            class="hidden"
            type="file"
            @change="handleImportSelection"
        />
        <input
            ref="attachmentInputRef"
            accept="image/*,.pdf,.ai,.eps,.psd,.png,.jpg,.jpeg,.svg"
            class="hidden"
            multiple
            type="file"
            @change="handleAttachmentSelection"
        />

        <AssignDesignerModal
            ref="assignModalRef"
            :initial-designer-id="assignRequestSnapshot?.assignedDesigners[0]?.designerId ?? null"
            :open="isAssignModalOpen"
            :request-code="assignRequestSnapshot?.requestCode ?? ''"
            @close="closeAssignModal"
            @confirm="confirmAssignment"
        />

        <WorkflowDecisionModal
            confirm-label="Aprobar solicitud"
            confirm-tone="primary"
            :description="`Confirma la aprobación de calidad${reviewModalTitleSuffix}.`"
            :open="isApproveModalOpen"
            title="Aprobar en calidad"
            @close="closeApproveModal"
            @confirm="confirmApprove"
        />

        <WorkflowDecisionModal
            confirm-label="Rechazar y crear nueva versión"
            confirm-tone="danger"
            :description="`Indica el motivo de rechazo${reviewModalTitleSuffix}. Se creará una nueva versión y volverá al diseñador.`"
            :open="isRejectModalOpen"
            require-comment
            title="Rechazar en calidad"
            @close="closeRejectModal"
            @confirm="confirmReject"
        />
    </AppShellLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'
import AppButton from '~/presentation/shared/components/ui/AppButton.vue'
import AssignDesignerModal from '~/presentation/requests/components/AssignDesignerModal.vue'
import WorkflowDecisionModal from '~/presentation/request-workflow/components/WorkflowDecisionModal.vue'
import { useRequestsModule } from '~/presentation/requests/composables/useRequestsModule'
import { useApiClient } from '~/presentation/shared/composables/useApiClient'
import {
    REQUEST_STATUS_LABELS,
    REQUEST_PRIORITY_LABELS,
    type RequestStatus,
    type RequestPriority,
} from '~/presentation/interfaces/requests/request.interface'

defineOptions({ name: 'DesignQueueView' })

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
    highPriorityRequests,
    tableRows,
    myAssignedRows,
    sendToQualityReview,
    approveQualityReview,
    rejectQualityReview,
    assignDesigner,
    removeDesignerAssignment,
    findRequestById,
    currentUserId,
    toggleChecklist,
    uploadAttachments,
    handleImportSelection,
    exportRequests,
    hydrateRequests,
} = useRequestsModule()

const selectedRequestId = ref('')
const designers = ref<Designer[]>([])
const activeFilter = ref<'all' | RequestStatus>('all')

// ── Row sources ───────────────────────────────────────────────────────────────

const sourceRows = computed(() => (isDisenador.value ? myAssignedRows.value : tableRows.value))

const filteredRows = computed(() => {
    if (activeFilter.value === 'all') return sourceRows.value
    return sourceRows.value.filter((r) => r.status === activeFilter.value)
})

// ── Status filter tabs ────────────────────────────────────────────────────────

const STATUS_TAB_ORDER: RequestStatus[] = [
    'CREATED',
    'PENDING_DESIGN_REVIEW',
    'ASSIGNED_TO_DESIGNER',
    'IN_DESIGN',
    'SENT_TO_QUALITY',
    'QUALITY_REJECTED',
    'QUALITY_APPROVED',
    'DELIVERED_TO_SALES',
    'CANCELLED',
]

const statusTabs = computed(() => {
    const all = { key: 'all' as const, label: 'Todas', count: sourceRows.value.length }
    const byStatus = STATUS_TAB_ORDER.map((status) => ({
        key: status,
        label: REQUEST_STATUS_LABELS[status],
        count: sourceRows.value.filter((r) => r.status === status).length,
    })).filter((tab) => tab.count > 0 || tab.key === 'QUALITY_REJECTED')
    return [all, ...byStatus]
})

// ── Selected row / request ────────────────────────────────────────────────────

const selectedRow = computed(() => {
    const match = filteredRows.value.find((row) => row.id === selectedRequestId.value)
    return match ?? filteredRows.value[0] ?? null
})

const selectedRequest = computed(() =>
    selectedRow.value ? findRequestById(selectedRow.value.id) : null,
)

// ── Stats ─────────────────────────────────────────────────────────────────────

const unassignedCount = computed(
    () =>
        sourceRows.value.filter((r) => ['CREATED', 'PENDING_DESIGN_REVIEW'].includes(r.status))
            .length,
)
const inDesignCount = computed(
    () =>
        sourceRows.value.filter((r) => ['ASSIGNED_TO_DESIGNER', 'IN_DESIGN'].includes(r.status))
            .length,
)
const inQualityCount = computed(
    () =>
        sourceRows.value.filter((r) => ['SENT_TO_QUALITY', 'QUALITY_REJECTED'].includes(r.status))
            .length,
)

// ── Labels & classes ──────────────────────────────────────────────────────────

const resolveStatusLabel = (status: string) =>
    REQUEST_STATUS_LABELS[status as RequestStatus] ?? status

const resolvePriorityLabel = (priority: string) =>
    REQUEST_PRIORITY_LABELS[priority as RequestPriority] ?? priority

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

const resolveStatusClass = (status: string) =>
    STATUS_CLASSES[status] ?? 'border-outline/40 text-outline-variant'

const PRIORITY_CLASSES: Record<string, string> = {
    URGENT: 'border-red-500/40 bg-red-500/10 text-red-300',
    HIGH: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
    MEDIUM: 'border-blue-400/40 bg-blue-400/10 text-blue-300',
    LOW: 'border-outline/40 text-outline-variant',
}

const resolvePriorityClass = (priority: string) =>
    PRIORITY_CLASSES[priority] ?? 'border-outline/40 text-outline-variant'

// ── Business rules ────────────────────────────────────────────────────────────

const ASSIGNABLE_STATUSES: RequestStatus[] = [
    'CREATED',
    'PENDING_DESIGN_REVIEW',
    'ASSIGNED_TO_DESIGNER',
    'QUALITY_REJECTED',
]

const isAssignable = (status: string) => ASSIGNABLE_STATUSES.includes(status as RequestStatus)

const canSendToQuality = (row: { status: string; assignedDesigners: { designerId: string }[] }) => {
    const blockedStatuses: RequestStatus[] = [
        'SENT_TO_QUALITY',
        'QUALITY_APPROVED',
        'DELIVERED_TO_SALES',
        'CANCELLED',
    ]
    if (blockedStatuses.includes(row.status as RequestStatus)) return false
    if (isJefe.value) return true
    return row.assignedDesigners.some((a) => a.designerId === currentUserId.value)
}

// ── Checklist ─────────────────────────────────────────────────────────────────

const getChecklist = (rowId: string) => {
    const r = findRequestById(rowId)
    return {
        artCompleted: r?.artCompleted ?? false,
        mechanicalCompleted: r?.mechanicalCompleted ?? false,
        dummyCompleted: r?.dummyCompleted ?? false,
    }
}

const canToggleChecklist = (row: { id: string; assignedDesigners: { designerId: string }[] }) => {
    if (isJefe.value) return true
    if (!isDisenador.value) return false
    return row.assignedDesigners.some((a) => a.designerId === currentUserId.value)
}

const allChecklistCompleted = (rowId: string) => {
    const c = getChecklist(rowId)
    return c.artCompleted && c.mechanicalCompleted && c.dummyCompleted
}

const handleToggleChecklist = (requestId: string, item: 'art' | 'mechanical' | 'dummy') => {
    void toggleChecklist(requestId, item)
}

// ── Table actions ─────────────────────────────────────────────────────────────

const getAvailableDesigners = (row: { assignedDesigners: { designerId: string }[] }) => {
    const assignedIds = new Set(row.assignedDesigners.map((a) => a.designerId))
    return designers.value.filter((d) => !assignedIds.has(d.id))
}

const onRemoveDesigner = (requestId: string, designerId: string) => {
    void removeDesignerAssignment(requestId, designerId)
}

const goToEditRequest = (requestId: string) => {
    if (requestId) void router.push(`/solicitudes/${requestId}/editar`)
}

// ── Assign designer modal ─────────────────────────────────────────────────────

// ── Designer file upload ──────────────────────────────────────────────────────

const attachmentInputRef = ref<HTMLInputElement | null>(null)
const isUploadingAttachment = ref(false)

const triggerAttachmentUpload = () => attachmentInputRef.value?.click()

const handleAttachmentSelection = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const files = Array.from(target.files ?? [])
    target.value = ''
    if (!files.length || !selectedRow.value) return

    isUploadingAttachment.value = true
    const filePayloads = await Promise.all(
        files.map(
            (file) =>
                new Promise<{ originalName: string; mimeType: string; base64Content: string }>(
                    (resolve) => {
                        const reader = new FileReader()
                        reader.onload = () => {
                            const base64Content = (reader.result as string).split(',')[1] ?? ''
                            resolve({ originalName: file.name, mimeType: file.type, base64Content })
                        }
                        reader.readAsDataURL(file)
                    },
                ),
        ),
    )
    await uploadAttachments(selectedRow.value.id, filePayloads)
    isUploadingAttachment.value = false
}

const assignModalRef = ref<InstanceType<typeof AssignDesignerModal> | null>(null)
const isAssignModalOpen = ref(false)
const assignRequestId = ref('')
const assignRequestSnapshot = computed(() =>
    assignRequestId.value ? findRequestById(assignRequestId.value) : null,
)

const openAssignModal = (requestId: string) => {
    assignRequestId.value = requestId
    isAssignModalOpen.value = true
}

const closeAssignModal = () => {
    isAssignModalOpen.value = false
    assignRequestId.value = ''
    assignModalRef.value?.resetSubmitting()
}

const confirmAssignment = async (designerId: string, designerName: string) => {
    if (!assignRequestId.value) {
        closeAssignModal()
        return
    }
    const succeeded = await assignDesigner(assignRequestId.value, designerId, designerName)
    assignModalRef.value?.resetSubmitting()
    if (succeeded) closeAssignModal()
}

// ── Quality review modals ─────────────────────────────────────────────────────

const isApproveModalOpen = ref(false)
const isRejectModalOpen = ref(false)
const reviewRequestId = ref('')
const reviewRequestSnapshot = computed(() =>
    reviewRequestId.value ? findRequestById(reviewRequestId.value) : null,
)
const reviewModalTitleSuffix = computed(() =>
    reviewRequestSnapshot.value ? ` · ${reviewRequestSnapshot.value.requestCode}` : '',
)

const closeApproveModal = () => {
    isApproveModalOpen.value = false
    reviewRequestId.value = ''
}
const closeRejectModal = () => {
    isRejectModalOpen.value = false
    reviewRequestId.value = ''
}

const confirmApprove = async () => {
    if (!reviewRequestId.value) {
        closeApproveModal()
        return
    }
    const succeeded = await approveQualityReview(reviewRequestId.value)
    if (succeeded) closeApproveModal()
}

const confirmReject = async () => {
    if (!reviewRequestId.value) {
        closeRejectModal()
        return
    }
    const succeeded = await rejectQualityReview(reviewRequestId.value)
    if (succeeded) closeRejectModal()
}

// ── Mount ─────────────────────────────────────────────────────────────────────

onMounted(async () => {
    await hydrateRequests()

    const first = filteredRows.value[0]
    if (first) selectedRequestId.value = first.id

    if (isJefe.value) {
        try {
            const response = await apiClient.get<Designer[]>('/users/designers')
            designers.value = response.data
        } catch {
            // non-critical
        }
    }
})

useHead(() => ({
    title: 'RUASA ERP - Bandeja Diseño',
    htmlAttrs: { lang: 'es' },
    bodyAttrs: { class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant' },
}))
</script>
