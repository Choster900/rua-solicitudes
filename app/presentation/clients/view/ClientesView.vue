<template>
  <AppShellLayout screen-title="Clientes">
    <section class="flex min-h-[calc(100vh-112px)] items-center justify-center">
      <h1 class="text-center text-5xl font-display-lg font-bold text-white">
        Hola, soy la pantalla de clientes
      </h1>
    </section>
  </AppShellLayout>
</template>

<script setup lang="ts">
import AppShellLayout from '~/presentation/shared/components/layout/AppShellLayout.vue'

defineOptions({
  name: 'ClientesView',
})

useHead(() => ({
  title: 'RUASA ERP - Clientes',
  htmlAttrs: {
    lang: 'es',
  },
  bodyAttrs: {
    class: 'font-body-md overflow-hidden bg-deep-navy text-on-surface-variant',
  },
}))
</script>
