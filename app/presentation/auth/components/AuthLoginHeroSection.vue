<template>
  <section class="hidden lg:block lg:h-screen lg:w-7/12 relative self-stretch">
    <div class="absolute inset-0 z-0">
      <img
        class="block h-full w-full object-cover"
        src="https://lh3.googleusercontent.com/aida/ADBb0uj0GJ0InBl9HcheG5djeV1tkUvsjpv8ysLBSfrYEt1MYqoWS9cPZA148HI5PWNfS_kWOp_nokmPXN-S1zNJR1l4hkJsUSQhDywTu-DxfhHCjnyUFbKEFp0CDZSLzLHuyVn4wSocZgl9SuH258DxAHTZ_IJ_So9h087LCRJuMi2HDX8LwMoqhlDUW5E79hUFPH92TPjc9opRDkVq1kwvrsjZZBRAzORsdsL5g7XWryBaT8EbHUXLSYxCmLw"
        alt="A dramatic low-key industrial photograph"
      >
      <div class="absolute inset-0 industrial-overlay z-10" />
    </div>
    <div class="relative z-20 h-full max-w-2xl flex flex-col justify-end gap-stack-md p-20">
      <div class="mb-4 h-1 w-16 bg-secondary-container" />
      <h1 class="text-display-lg font-display-lg leading-tight text-white">
        Excelencia en cada <span class="text-secondary-container">empaque</span>.
      </h1>
      <p class="text-body-lg font-body-lg text-surface-variant/80">
        Gestión integrada para la industria del cartón y artes gráficas. Precisión,
        estructura y control en una sola plataforma.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AuthLoginHeroSection',
})
</script>

<style scoped>
.industrial-overlay {
  background: linear-gradient(to right, #0B1120 0%, rgba(11, 17, 32, 0.8) 40%, transparent 100%);
}
</style>
