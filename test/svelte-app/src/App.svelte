<script>
  import cookies from 'simple-cookie-service'

  let val = $state(cookies.get('test_svelte') || '')

  function setCookie() {
    cookies.set('test_svelte', 'Hello from Svelte ' + new Date().toLocaleTimeString(), { expires: 1 })
    val = cookies.get('test_svelte') || ''
  }

  function clearCookie() {
    cookies.remove('test_svelte')
    val = cookies.get('test_svelte') || ''
  }
</script>

<div style="padding: 20px; font-family: sans-serif;">
  <h1>Svelte Cookie Test</h1>
  <button onclick={setCookie} style="padding: 10px; cursor: pointer;">Set Cookie</button>
  <button onclick={clearCookie} style="padding: 10px; margin-left: 10px; cursor: pointer;">Clear Cookie</button>
  <p>Value: <strong>{val}</strong></p>
</div>