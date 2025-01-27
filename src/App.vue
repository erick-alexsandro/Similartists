<script setup>
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="app">
    <NavBar />
    <!-- <MainPage /> -->
    <RouterView />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 5rem;
}
</style>
