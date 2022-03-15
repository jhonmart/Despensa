<template>
  <div class="stock-grid">
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'App'
}
</script>

<style>
.stock-grid {
  font-family: Montserrat, "Open Sans", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: auto;
  overflow: hidden;
}
</style>
