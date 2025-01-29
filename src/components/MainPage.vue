<script setup>
import MagnifyIcon from "./icons/MagnifyIcon.vue";
import AboutPage from "./AboutPage.vue";
</script>

<template>
  <div class="page">
    <div class="main-page">
      <div class="main-page-invite-title">
        <div class="main-page-text">
          <h1 class="main-page-title">
            Find similar artists to your favorites with just one click...
          </h1>
          <p class="main-page-subtitle">and a couple of typings</p>
        </div>
        <div class="main-page-button">
          <RouterLink to="/search">Find</RouterLink>
          <MagnifyIcon />
        </div>
      </div>
    </div>
    <AboutPage />
  </div>
</template>

<style scoped>
.main-page-text {
  max-width: 100%;
  margin-bottom: 2rem;
}

.main-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 90vh;
  padding: 0 1rem;
}
.main-page-invite-title {
  display: flex;
  flex-direction: column;
  text-align: left;
  justify-content: center;
  top: 50%;
  left: 50%;
  gap: 0px;
  padding: 0 8rem;
}
.main-page-title {
  font-family: ArgentumSans-Regular, sans-serif;
  font-size: 5rem;
  line-height: 0.9;
}
.main-page-subtitle {
  font-family: ArgentumSans-Light, sans-serif;
  font-size: 2.5rem;
  margin-top: -35px;
  
}
.main-page-button {
  font-family: ArgentumSans-Light, sans-serif;
  font-size: 1.5rem;
  text-decoration: none;
  color: var(--main-text);
  border: 3px solid var(--main-text);
  height: 50px;
  width: 120px;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  transition: 0.3s;
}
.main-page-button:hover {
  cursor: pointer;
  background-color: var(--main-text);
  color: #ffffff;
}

.main-page-button:hover a {
  color: #ffffff;
}

@media screen and (max-width: 480px) {
  .main-page-title {
    font-size: 2.5rem;
  }
  .main-page-subtitle {
    font-size: 1.2rem;
    margin-top: -20px;
  }
  .main-page-invite-title {
    padding: 4rem 2rem;
  }
}

@media screen and (max-width: 320px) {
  .main-page-title {
    font-size: 2rem;
  }
  .main-page-subtitle {
    font-size: 1rem;
    margin-top: -15px;
  }
}

@media screen and (max-width: 768px) {
  .page {
    padding: 0 !important;
  }
}

@media screen and (max-width: 680px) {
  .main-page-invite-title {
    padding: 4rem 1rem;
  }
  .main-page-title {
    font-size: 3rem;
  }
  .main-page-subtitle {
    font-size: 1.5rem;
    margin-top: -25px;
  }
  
}

</style>
