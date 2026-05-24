<template>
  <AppShellLayout>
    <section class="flex min-h-[calc(100vh-112px)] items-center justify-center">
      <h1 class="text-center text-5xl font-display-lg font-bold text-white">
        Hola, soy la pantalla de calidad
      </h1>
    </section>
  </AppShellLayout>
</template>

<script setup lang="ts">
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'

defineOptions({
  name: 'CalidadView',
})

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
