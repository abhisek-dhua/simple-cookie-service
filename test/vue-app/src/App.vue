<script setup lang="ts">
import { ref } from 'vue'
import cookies from 'simple-cookie-service'

const val = ref(cookies.get('test_vue') || '')

const setCookie = () => {
  cookies.set('test_vue', 'Hello from Vue ' + new Date().toLocaleTimeString(), { expires: 1 })
  val.value = cookies.get('test_vue') || ''
}

const clearCookie = () => {
  cookies.remove('test_vue')
  val.value = cookies.get('test_vue') || ''
}
</script>

<template>
  <div style="padding: 20px; font-family: sans-serif;">
    <h1>Vue Cookie Test</h1>
    <button @click="setCookie" style="padding: 10px; cursor: pointer;">Set Cookie</button>
    <button @click="clearCookie" style="padding: 10px; margin-left: 10px; cursor: pointer;">Clear Cookie</button>
    <p>Value: <strong>{{ val }}</strong></p>
  </div>
</template>