<template>
  <main
    :style="{ marginLeft: `${leftOffset}px` }"
    class="dashboard-scroll mt-16 h-[calc(100vh-64px)] overflow-y-auto bg-deep-navy transition-all duration-300"
  >
    <div class="min-h-full p-6">
      <slot />
    </div>
  </main>
</template>

<script setup lang="ts">
interface AppShellWorkspaceProps {
  leftOffset: number
}

defineOptions({
  name: 'AppShellWorkspace',
})

defineProps<AppShellWorkspaceProps>()
</script>
