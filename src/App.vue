<script setup>
import NavBar from './components/NavBar.vue'
import FooterComponent from './components/FooterComponent.vue';
</script>

<template>
  <div class="app">
    <NavBar />
    <!-- <MainPage /> -->
    <RouterView class="main-content" />
    <FooterComponent class="footercomponent" />
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
.main-content.scrolled .footercomponent { 
    transform: translateY(0); 
} 

.main-content:not(.scrolled) .footercomponent {
    transform: translateY(100%); 
}
</style>
