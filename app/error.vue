<template>
    <div class="min-h-screen bg-deep-navy flex items-center justify-center px-8">
        <div class="flex flex-col md:flex-row items-center gap-16 max-w-4xl w-full">
            <img
                src="~/assets/images/404page.png"
                alt="Caja vacía 404"
                class="w-72 md:w-96 object-contain flex-shrink-0"
            />

            <div class="flex flex-col items-center md:items-start text-center md:text-left gap-4">
                <span
                    class="text-8xl font-black leading-none tracking-tight"
                    style="color: #ae8c19"
                >
                    404
                </span>
                <h1 class="text-2xl font-bold" style="color: #ae8c19">
                    Ooops, parece que esta caja está vacía
                </h1>
                <p class="text-sm" style="color: #8faac8">
                    La página que buscas no existe o fue movida.
                </p>
                <p class="text-xs font-mono uppercase tracking-widest" style="color: #5a7a99">
                    404 Not Found
                </p>
                <button
                    class="mt-4 px-6 py-3 rounded-xl bg-primary text-white font-semibold text-sm transition hover:opacity-90 active:scale-95"
                    @click="handleError"
                >
                    Volver al inicio
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useError, clearError } from '#app'

const error = useError()
console.error('[404]', error.value)

const handleError = () => clearError({ redirect: '/' })
</script>
