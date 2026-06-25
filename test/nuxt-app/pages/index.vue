<script setup lang="ts">
import { ref, onMounted } from 'vue'

const val = ref('')

onMounted(async () => {
  const { default: cookies } = await import('simple-cookie-service')
  val.value = cookies.get('test_nuxt') || ''

  const setCookie = () => {
    cookies.set('test_nuxt', 'Hello from Nuxt ' + new Date().toLocaleTimeString(), { expires: 1 })
    val.value = cookies.get('test_nuxt') || ''
  }

  const clearCookie = () => {
    cookies.remove('test_nuxt')
    val.value = cookies.get('test_nuxt') || ''
  }

  // Expose to template
  ;(window as any).__setCookie = setCookie
  ;(window as any).__clearCookie = clearCookie
})

const setCookie = async () => {
  const { default: cookies } = await import('simple-cookie-service')
  cookies.set('test_nuxt', 'Hello from Nuxt ' + new Date().toLocaleTimeString(), { expires: 1 })
  val.value = cookies.get('test_nuxt') || ''
}

const clearCookie = async () => {
  const { default: cookies } = await import('simple-cookie-service')
  cookies.remove('test_nuxt')
  val.value = cookies.get('test_nuxt') || ''
}
</script>

<template>
  <div style="padding: 20px; font-family: sans-serif;">
    <h1>Nuxt Cookie Test</h1>
    <button @click="setCookie" style="padding: 10px; cursor: pointer;">Set Cookie</button>
    <button @click="clearCookie" style="padding: 10px; margin-left: 10px; cursor: pointer;">Clear Cookie</button>
    <p>Value: <strong>{{ val }}</strong></p>
  </div>
</template>