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
            Find similar <b class="text-alt-color">artists</b> and
            <b class="text-alt-color">albums</b> with just one click...
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

.main-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 80vh;
}
.main-page-invite-title {
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  top: 50%;
  left: 50%;
  gap: 0px;
  padding: 8rem 7rem;
}
.main-page-title {
  font-family: ArgentumSans-Black, sans-serif;
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
  color: #000000;
  border: 1px solid #000;
  height: 50px;
  width: 120px;
  border-radius: 40px;
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  transition: 0.3s;
  box-shadow: 134px 176px 62px 0 rgba(0, 0, 0, 0),
    86px 112px 57px 0 rgba(0, 0, 0, 0.01), 48px 63px 48px 0 rgba(0, 0, 0, 0.05),
    21px 28px 35px 0 rgba(0, 0, 0, 0.09), 5px 7px 19px 0 rgba(0, 0, 0, 0.1);
}
.main-page-button:hover {
  cursor: pointer;
  background-color: var(--primary-color);
  color: #ffffff;
  border: 1px solid var(--primary-color);
}

.main-page-button:hover a {
  color: #ffffff;
}
</style>
