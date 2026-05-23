<template>
  <main
    class="min-h-screen overflow-x-hidden bg-deep-navy font-body-md text-on-surface selection:bg-primary-container selection:text-white lg:overflow-hidden"
  >
    <section class="flex min-h-screen w-full">
      <section class="relative hidden h-screen lg:block lg:w-7/12">
        <div class="absolute inset-0 z-0 overflow-hidden">
          <img
            ref="heroImageRef"
            class="h-full w-full object-cover transition-transform duration-300"
            :src="heroImageSrc"
            alt="Referencia visual industrial para la pantalla de acceso"
          >
          <div class="industrial-overlay absolute inset-0 z-10" />
        </div>

        <div class="relative z-20 flex h-full max-w-2xl flex-col justify-end gap-stack-md p-20">
          <div class="mb-4 h-1 w-16 bg-secondary-container" />
          <h1 class="font-display-lg text-display-lg leading-tight text-white">
            Excelencia en cada
            <span class="text-secondary-container">empaque</span>.
          </h1>
          <p class="font-body-lg text-body-lg text-surface-variant/80">
            Gestión integrada para la industria del cartón y artes gráficas.
            Precisión, estructura y control en una sola plataforma.
          </p>
        </div>
      </section>

      <section
        class="z-30 flex w-full flex-col items-center justify-center bg-deep-navy px-container-padding lg:w-5/12 lg:border-l lg:border-outline/10"
      >
        <div class="w-full max-w-md">
          <div class="mb-stack-lg flex justify-center">
            <img
              :src="logoImageSrc"
              alt="RUASA Logo"
              class="h-16 w-auto animate-fade-in object-contain brightness-0 invert opacity-90"
            >
          </div>

          <div class="mb-stack-lg text-center">
            <h2 class="mb-2 font-headline-md text-headline-md text-white">
              Acceso al Portal de Producción
            </h2>
            <p class="font-body-sm text-body-sm text-outline-variant">
              Ingrese sus credenciales corporativas para continuar
            </p>
          </div>

          <form
            id="loginForm"
            class="space-y-stack-md"
            @submit.prevent="handleSubmit"
          >
            <div class="group glow-effect transition-all duration-300">
              <label
                for="network-user"
                class="mb-2 block font-label-caps text-label-caps uppercase text-secondary-container"
              >
                Usuario de Red
              </label>
              <div class="relative">
                <span
                  class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline"
                >
                  person
                </span>
                <input
                  id="network-user"
                  v-model="username"
                  autocomplete="username"
                  required
                  type="text"
                  placeholder="usuario@ruasa.com.sv"
                  class="w-full rounded-xl border border-outline/30 bg-surface-container-lowest/5 py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-outline/70 focus:border-primary focus:ring-2 focus:ring-primary"
                >
              </div>
            </div>

            <div class="group glow-effect transition-all duration-300">
              <label
                for="network-password"
                class="mb-2 block font-label-caps text-label-caps uppercase text-secondary-container"
              >
                Contraseña
              </label>
              <div class="relative">
                <span
                  class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline"
                >
                  lock
                </span>
                <input
                  id="network-password"
                  v-model="password"
                  autocomplete="current-password"
                  required
                  type="password"
                  placeholder="••••••••"
                  class="w-full rounded-xl border border-outline/30 bg-surface-container-lowest/5 py-4 pl-12 pr-4 text-white outline-none transition-all placeholder:text-outline/70 focus:border-primary focus:ring-2 focus:ring-primary"
                >
              </div>
            </div>

            <div class="flex items-center justify-between py-2 text-body-sm">
              <label class="group flex cursor-pointer items-center gap-2">
                <input
                  v-model="rememberMe"
                  type="checkbox"
                  class="h-5 w-5 rounded border-outline/30 bg-transparent text-primary transition-all focus:ring-primary"
                >
                <span class="text-outline-variant transition-colors group-hover:text-white">
                  Recordarme
                </span>
              </label>
              <a
                href="#"
                class="font-bold text-primary-fixed-dim transition-colors hover:text-white"
              >
                ¿Olvidó su contraseña?
              </a>
            </div>

            <button
              type="submit"
              :disabled="isSubmitting || loginSucceeded"
              :class="[
                loginSucceeded
                  ? 'bg-status-success hover:bg-status-success/90'
                  : 'bg-primary hover:bg-primary-container',
                isSubmitting || loginSucceeded
                  ? 'cursor-not-allowed opacity-80'
                  : 'active:scale-[0.98]',
              ]"
              class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold text-white shadow-lg shadow-primary/20 transition-all"
            >
              <span class="font-headline-md text-body-md">{{ submitText }}</span>
              <span
                class="material-symbols-outlined"
                :class="{ 'animate-spin': isSubmitting }"
              >
                {{ submitIcon }}
              </span>
            </button>
          </form>

          <div class="mt-stack-lg w-full">
            <div class="relative mb-8 flex items-center justify-center">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-outline/10" />
              </div>
              <span
                class="relative bg-deep-navy px-4 font-label-caps text-label-caps uppercase text-outline"
              >
                O continuar con
              </span>
            </div>

            <div class="flex gap-stack-md">
              <button
                type="button"
                class="group flex flex-1 flex-col items-center gap-2 rounded-xl border border-outline/20 bg-surface-container-lowest/5 py-3 transition-all hover:border-primary/50 hover:bg-primary/10"
              >
                <span
                  class="material-symbols-outlined text-outline group-hover:text-primary-fixed-dim"
                  style="font-variation-settings: 'FILL' 0"
                >
                  fingerprint
                </span>
                <span
                  class="font-label-caps text-[10px] uppercase text-outline group-hover:text-white"
                >
                  Huella Digital
                </span>
              </button>

              <button
                type="button"
                class="group flex flex-1 flex-col items-center gap-2 rounded-xl border border-outline/20 bg-surface-container-lowest/5 py-3 transition-all hover:border-primary/50 hover:bg-primary/10"
              >
                <span
                  class="material-symbols-outlined text-outline group-hover:text-primary-fixed-dim"
                  style="font-variation-settings: 'FILL' 0"
                >
                  face
                </span>
                <span
                  class="font-label-caps text-[10px] uppercase text-outline group-hover:text-white"
                >
                  Face ID
                </span>
              </button>

              <button
                type="button"
                class="group flex flex-1 flex-col items-center gap-2 rounded-xl border border-outline/20 bg-surface-container-lowest/5 py-3 transition-all hover:border-primary/50 hover:bg-primary/10"
              >
                <span
                  class="material-symbols-outlined text-outline group-hover:text-primary-fixed-dim"
                  style="font-variation-settings: 'FILL' 0"
                >
                  qr_code_2
                </span>
                <span
                  class="font-label-caps text-[10px] uppercase text-outline group-hover:text-white"
                >
                  Token QR
                </span>
              </button>
            </div>
          </div>

          <footer class="mt-20 text-center">
            <p class="font-label-caps text-[10px] uppercase tracking-widest text-outline/50">
              © {{ currentYear }} RUASA Enterprise Resource Planning<br>
              Seguridad de Grado Industrial • v2.4.0
            </p>
          </footer>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

defineOptions({
  name: 'AuthLoginPage',
})

useHead({
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: 'anonymous',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Metropolis:wght@400;500;700&family=JetBrains+Mono:wght@500&display=swap',
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
    },
  ],
})

const heroImageSrc = '/images/login-hero-industrial.jpg'
const logoImageSrc = '/images/ruasa-logo-white.png'

const username = ref('')
const password = ref('')
const rememberMe = ref(false)
const isSubmitting = ref(false)
const loginSucceeded = ref(false)
const heroImageRef = ref<HTMLImageElement | null>(null)

let submitTimeoutId: number | null = null
let redirectTimeoutId: number | null = null

const currentYear = new Date().getFullYear()

const submitText = computed(() => {
  if (isSubmitting.value) {
    return 'Validando...'
  }

  if (loginSucceeded.value) {
    return 'Acceso Concedido'
  }

  return 'Ingresar al Sistema'
})

const submitIcon = computed(() => {
  if (isSubmitting.value) {
    return 'progress_activity'
  }

  if (loginSucceeded.value) {
    return 'check_circle'
  }

  return 'login'
})

const clearPendingTimers = () => {
  if (submitTimeoutId !== null) {
    window.clearTimeout(submitTimeoutId)
    submitTimeoutId = null
  }

  if (redirectTimeoutId !== null) {
    window.clearTimeout(redirectTimeoutId)
    redirectTimeoutId = null
  }
}

const handleSubmit = () => {
  if (isSubmitting.value || loginSucceeded.value) {
    return
  }

  isSubmitting.value = true

  submitTimeoutId = window.setTimeout(() => {
    isSubmitting.value = false
    loginSucceeded.value = true

    redirectTimeoutId = window.setTimeout(() => {
      console.info('Redirigiendo a Dashboard...')
    }, 1000)
  }, 1800)
}

const handleMouseMove = (event: MouseEvent) => {
  if (!heroImageRef.value || window.innerWidth < 1024) {
    return
  }

  const x = (window.innerWidth - event.pageX * 2) / 100
  const y = (window.innerHeight - event.pageY * 2) / 100
  heroImageRef.value.style.transform = `scale(1.05) translate(${x}px, ${y}px)`
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove)
})

onUnmounted(() => {
  clearPendingTimers()
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
.material-symbols-outlined {
    font-variation-settings:
        'FILL' 0,
        'wght' 400,
        'GRAD' 0,
        'opsz' 24;
}

.industrial-overlay {
    background: linear-gradient(to right, #0b1120 0%, rgb(11 17 32 / 80%) 40%, transparent 100%);
}

.glow-effect:focus-within {
    box-shadow: 0 0 20px rgb(0 86 150 / 30%);
}
</style>
