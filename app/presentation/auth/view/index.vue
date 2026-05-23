<template>
  <main class="flex min-h-screen lg:h-screen w-full bg-deep-navy font-body-md text-on-surface selection:bg-primary-container selection:text-white overflow-x-hidden">
    <section class="hidden lg:block lg:h-screen lg:w-7/12 relative self-stretch">
      <div class="absolute inset-0 z-0">
        <img
          class="block w-full h-full object-cover"
          data-alt="A dramatic low-key industrial photograph of a high-precision cardboard cutting machine in a modern factory. The lighting is focused and moody, highlighting the metallic textures and geometric precision of the equipment. A dark blue color palette dominates the scene, evoking a sense of reliability and advanced manufacturing technology. Deep shadows and subtle reflections create a sophisticated, high-end corporate atmosphere."
          src="https://lh3.googleusercontent.com/aida/ADBb0uj0GJ0InBl9HcheG5djeV1tkUvsjpv8ysLBSfrYEt1MYqoWS9cPZA148HI5PWNfS_kWOp_nokmPXN-S1zNJR1l4hkJsUSQhDywTu-DxfhHCjnyUFbKEFp0CDZSLzLHuyVn4wSocZgl9SuH258DxAHTZ_IJ_So9h087LCRJuMi2HDX8LwMoqhlDUW5E79hUFPH92TPjc9opRDkVq1kwvrsjZZBRAzORsdsL5g7XWryBaT8EbHUXLSYxCmLw"
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
            class="h-12 w-auto object-contain brightness-0 invert opacity-90"
            src="https://lh3.googleusercontent.com/aida/ADBb0ujiXx9N50DdfTe9CfsLyYlpeSMdQBeJ4edwvqQHduYKretEy9UGjRUgBUvuM-ZF69AH2oixZbYNwCBqGrFl1ob-apaw0fpIBU_SE-RBpEk-mdcZjCdDp1zpWl7OBELMyvXbGBehb0pwHrE6PHbRsdBiyvdSqWrx37WjPVhLU4TPPorf2yfIO0HauZa76jOR0KmeXYi4JZUuLwDlfjup7DP5xw5zc5ATh1GAPiF5kb37UfcX_eNV_y9MdQ"
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
          id="loginForm"
          class="w-full space-y-4"
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
                class="w-full bg-surface-container-lowest/5 border border-outline/30 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                placeholder="usuario@ruasa.com.sv"
                type="text"
              >
            </div>
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
                class="w-full bg-surface-container-lowest/5 border border-outline/30 rounded-lg py-2.5 pl-10 pr-3 text-sm text-white focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none"
                placeholder="••••••••"
                type="password"
              >
            </div>
          </div>
          <div class="flex flex-wrap items-center justify-between gap-2 text-[0.8rem] py-1">
            <label class="flex items-center gap-2 cursor-pointer group shrink-0">
              <input
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
          >
            <span class="text-sm font-headline-md">Ingresar al Sistema</span>
            <span class="material-symbols-outlined">login</span>
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
import { onMounted, onUnmounted } from 'vue'

defineOptions({
  name: 'AuthLoginPage',
})

const router = useRouter()

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
let formElement: HTMLFormElement | null = null
let submitHandler: ((event: Event) => void) | null = null
let mouseMoveHandler: ((event: MouseEvent) => void) | null = null

onMounted(() => {
  formElement = document.getElementById('loginForm') as HTMLFormElement | null

  submitHandler = (event: Event) => {
    event.preventDefault()

    const currentForm = event.currentTarget as HTMLFormElement | null
    const button = currentForm?.querySelector('button[type="submit"]') as HTMLButtonElement | null
    const usernameInput = currentForm?.querySelector('input[type="text"]') as HTMLInputElement | null
    const passwordInput = currentForm?.querySelector('input[type="password"]') as HTMLInputElement | null

    if (!button) {
      return
    }

    const hasValidCredentials = Boolean(usernameInput?.value.trim()) && Boolean(passwordInput?.value.trim())

    if (!hasValidCredentials) {
      return
    }

    button.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span> Validando...'
    button.disabled = true
    button.classList.add('opacity-80', 'cursor-not-allowed')

    submitTimeoutId = window.setTimeout(() => {
      button.innerHTML = '<span class="material-symbols-outlined">check_circle</span> Acceso Concedido'
      button.classList.remove('bg-primary')
      button.classList.add('bg-status-success')

      redirectTimeoutId = window.setTimeout(() => {
        void router.push('/dashboard')
      }, 1000)
    }, 1800)
  }

  if (formElement && submitHandler) {
    formElement.addEventListener('submit', submitHandler)
  }

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

  if (formElement && submitHandler) {
    formElement.removeEventListener('submit', submitHandler)
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
