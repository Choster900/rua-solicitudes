<template>
    <span :class="badgeClass">
        <span class="inline-block h-1.5 w-1.5 rounded-full bg-current opacity-90" />
        {{ label }}
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type AppStatusBadgeTone = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

interface AppStatusBadgeProps {
    label: string
    tone?: AppStatusBadgeTone
}

defineOptions({
    name: 'AppStatusBadge',
})

const props = withDefaults(defineProps<AppStatusBadgeProps>(), {
    tone: 'neutral',
})

const toneClassMap: Record<AppStatusBadgeTone, string> = {
    success: 'border-emerald-400/40 bg-emerald-500/15 text-emerald-200',
    warning: 'border-amber-400/40 bg-amber-500/15 text-amber-200',
    danger: 'border-rose-400/40 bg-rose-500/15 text-rose-200',
    info: 'border-sky-400/40 bg-sky-500/15 text-sky-200',
    neutral: 'border-slate-400/40 bg-slate-500/15 text-slate-200',
}

const badgeClass = computed(() => {
    return [
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]',
        toneClassMap[props.tone],
    ]
})
</script>
