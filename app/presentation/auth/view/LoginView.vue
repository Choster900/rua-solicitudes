<template>
  <main class="flex min-h-screen lg:h-screen w-full bg-deep-navy font-body-md text-on-surface selection:bg-primary-container selection:text-white overflow-x-hidden">
    <section class="hidden lg:block lg:h-screen lg:w-7/12 relative self-stretch">
      <div class="absolute inset-0 z-0">
        <img
          class="block w-full h-full object-cover"
          data-alt="A dramatic low-key industrial photograph of a high-precision cardboard cutting machine in a modern factory. The lighting is focused and moody, highlighting the metallic textures and geometric precision of the equipment. A dark blue color palette dominates the scene, evoking a sense of reliability and advanced manufacturing technology. Deep shadows and subtle reflections create a sophisticated, high-end corporate atmosphere."
          src="../../../assets/images/banner-login.jpg"
          alt="A dramatic low-key industrial photograph"
        >
        <div class="absolute inset-0 industrial-overlay z-10" />
      </div>
      <div class="relative z-20 h-full flex flex-col justify-end p-20 gap-stack-md max-w-2xl">
        <div class="w-16 h-1 bg-secondary-container mb-4" />
        <h1 class="font-display-lg text-display-lg text-white leading-tight">
          Excelencia en cada <span class="text-secondary-container">empaque</span>.
        </h1>
        <p class="font-body-lg text-body-lg text-surface-variant/80">
          Gestión integrada para la industria del cartón y artes gráficas. Precisión,
          estructura y control en una sola plataforma.
        </p>
      </div>
    </section>
    <section
      class="w-full lg:w-5/12 flex flex-col justify-center items-center px-5 sm:px-8 lg:px-container-padding py-8 sm:py-10 bg-deep-navy lg:border-l border-outline/10 z-30"
    >
      <div class="w-full max-w-sm sm:max-w-md lg:max-w-sm flex flex-col items-center">
        <div class="mb-6 animate-fade-in">
          <img
            alt="RUASA Logo"
            class="h-12 w-auto object-contain opacity-90"
            :src="loginLogoSrc"
          >
        </div>
        <div class="w-full text-center mb-6">
          <h2 class="font-headline-md text-[1.3rem] text-white mb-1">
            Acceso al Portal de Producción
          </h2>
          <p class="font-body-sm text-[0.8rem] text-outline-variant">
            Ingrese sus credenciales corporativas para continuar
          </p>
        </div>
        <form
          class="w-full space-y-4"
          @submit.prevent="handleSubmit"
        >
          <div class="group glow-effect transition-all duration-300">
            <label class="font-label-caps text-[0.65rem] text-secondary-container mb-1.5 block uppercase">
              Usuario de Red
            </label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                person
              </span>
              <input
                v-model="networkUser"
                class="w-full bg-surface-container-lowest/5 border rounded-lg py-2.5 pl-10 pr-3 text-sm text-white focus:ring-2 focus:ring-primary transition-all outline-none"
                :class="networkUserError ? 'border-status-error focus:border-status-error focus:ring-status-error/40' : 'border-outline/30 focus:border-primary'"
                placeholder="usuario@ruasa.com.sv"
                type="text"
                @input="networkUserError = ''"
              >
            </div>
            <p
              v-if="networkUserError"
              class="mt-1 text-xs text-status-error"
            >
              {{ networkUserError }}
            </p>
          </div>
          <div class="group glow-effect transition-all duration-300">
            <label class="font-label-caps text-[0.65rem] text-secondary-container mb-1.5 block uppercase">
              Contraseña
            </label>
            <div class="relative">
              <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
                lock
              </span>
              <input
                v-model="password"
                class="w-full bg-surface-container-lowest/5 border rounded-lg py-2.5 pl-10 pr-3 text-sm text-white focus:ring-2 focus:ring-primary transition-all outline-none"
                :class="passwordError ? 'border-status-error focus:border-status-error focus:ring-status-error/40' : 'border-outline/30 focus:border-primary'"
                placeholder="••••••••"
                :type="showPassword ? 'text' : 'password'"
                @input="passwordError = ''"
              >
              <button
                class="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-outline transition-colors hover:bg-surface-container-low/10 hover:text-white"
                type="button"
                :title="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                @click="showPassword = !showPassword"
              >
                <span class="material-symbols-outlined text-[20px]">
                  {{ showPassword ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
            </div>
            <p
              v-if="passwordError"
              class="mt-1 text-xs text-status-error"
            >
              {{ passwordError }}
            </p>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-2 text-[0.8rem] py-1">
            <label class="flex items-center gap-2 cursor-pointer group shrink-0">
              <input
                v-model="rememberMe"
                class="w-4 h-4 rounded border-outline/30 bg-transparent text-primary focus:ring-primary transition-all"
                type="checkbox"
              >
              <span class="text-outline-variant group-hover:text-white transition-colors">Recordarme</span>
            </label>
            <a
              class="text-primary-fixed-dim hover:text-white font-bold transition-colors text-right"
              href="#"
            >
              ¿Olvidó su contraseña?
            </a>
          </div>
          <button
            class="w-full bg-primary hover:bg-primary-container text-white font-bold py-2.5 rounded-lg shadow-lg shadow-primary/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
            type="submit"
            :disabled="isSubmitting"
            :class="isSubmitting ? 'opacity-80 cursor-not-allowed' : ''"
          >
            <span class="text-sm font-headline-md">
              {{ isSubmitSuccess ? 'Acceso Concedido' : isSubmitting ? 'Validando...' : 'Ingresar al Sistema' }}
            </span>
            <span
              class="material-symbols-outlined"
              :class="{ 'login-spinner': isSubmitting }"
            >
              {{ isSubmitting ? 'progress_activity' : isSubmitSuccess ? 'check_circle' : 'login' }}
            </span>
          </button>
        </form>
        <footer class="mt-8 sm:mt-10 text-center">
          <p class="text-[10px] font-label-caps text-outline/50 uppercase tracking-widest">
            © 2024 RUASA Enterprise Resource Planning<br>
            Seguridad de Grado Industrial • v2.4.0
          </p>
        </footer>
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import logoModoOscuro from '~/assets/logos/rua_logo_modo_oscuro_transparente.png'

defineOptions({
  name: 'LoginView',
})

const router = useRouter()
const loginLogoSrc = logoModoOscuro
const networkUser = ref('admin@ruasa.com.sv')
const password = ref('12345678')
const rememberMe = ref(false)
const networkUserError = ref('')
const passwordError = ref('')
const showPassword = ref(false)
const isSubmitting = ref(false)
const isSubmitSuccess = ref(false)

useHead({
  htmlAttrs: {
    class: 'dark',
    lang: 'es',
  },
  bodyAttrs: {
    class: 'bg-deep-navy font-body-md text-on-surface selection:bg-primary-container selection:text-white overflow-x-hidden',
  },
})

let submitTimeoutId: number | null = null
let redirectTimeoutId: number | null = null
let mouseMoveHandler: ((event: MouseEvent) => void) | null = null

const validateRequiredFields = () => {
  networkUserError.value = networkUser.value.trim() ? '' : 'Este campo es requerido.'
  passwordError.value = password.value.trim() ? '' : 'Este campo es requerido.'

  return !networkUserError.value && !passwordError.value
}

const handleSubmit = () => {
  if (isSubmitting.value) {
    return
  }

  isSubmitSuccess.value = false
  const hasValidFields = validateRequiredFields()

  if (!hasValidFields) {
    return
  }

  isSubmitting.value = true

  submitTimeoutId = window.setTimeout(() => {
    isSubmitting.value = false
    isSubmitSuccess.value = true

    redirectTimeoutId = window.setTimeout(() => {
      void router.push('/dashboard')
    }, 1000)
  }, 1800)
}

onMounted(() => {
  mouseMoveHandler = (event: MouseEvent) => {
    const image = document.querySelector('img[data-alt]') as HTMLImageElement | null

    if (!image) {
      return
    }

    const x = (window.innerWidth - event.pageX * 2) / 100
    const y = (window.innerHeight - event.pageY * 2) / 100
    image.style.transform = `scale(1.05) translate(${x}px, ${y}px)`
  }

  if (mouseMoveHandler && window.matchMedia('(min-width: 1024px)').matches) {
    document.addEventListener('mousemove', mouseMoveHandler)
  }
})

onUnmounted(() => {
  if (submitTimeoutId !== null) {
    window.clearTimeout(submitTimeoutId)
  }

  if (redirectTimeoutId !== null) {
    window.clearTimeout(redirectTimeoutId)
  }

  if (mouseMoveHandler) {
    document.removeEventListener('mousemove', mouseMoveHandler)
  }
})
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}

.login-spinner {
  display: inline-flex;
  animation: login-spin 0.85s linear infinite;
}

@keyframes login-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.font-body-sm,
.font-body-md,
.font-body-lg {
  font-family: var(--app-font-sans);
}

.font-headline-lg,
.font-headline-md,
.font-display-lg,
.font-label-caps {
  font-family: var(--app-font-sans);
}

.font-data-mono {
  font-family: var(--app-font-mono);
}

.industrial-overlay {
  background: linear-gradient(to right, #0B1120 0%, rgba(11, 17, 32, 0.8) 40%, transparent 100%);
}

.glow-effect:focus-within {
  box-shadow: 0 0 20px rgba(0, 86, 150, 0.3);
}
</style>
