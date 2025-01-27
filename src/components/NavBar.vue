<script setup></script>

<template>
  <div class="navbar-container">
    <div class="navbar-logo">
      <router-link to="/">Similartists</router-link>
    </div>
    <div class="navbar-options">
        <a class="navbar-item" href="/search">Find</a>
        <a class="navbar-item" href="#about">About</a>
      </div>
  </div>
</template>

<style scoped>
.navbar-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 3rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  border-bottom: 3px solid var(--main-text);
  background-color: var(--main-bg);
}
.navbar-logo {
  font-family: ArgentumSans-Black, sans-serif;
  font-size: 1.7rem;
  font-weight: bold;
  color: var(--main-text);
}
.navbar-options {
    display: flex;
    flex-direction: row;
    gap: 2rem;
    font-size: 1rem;
}
.navbar-item {
    font-family: ArgentumSans-Regular, sans-serif;
    text-decoration: none;
    transition: 0.3s;
    color: var(--main-text);
}
.navbar-item:hover {
    opacity: 60%;
    cursor: pointer;
}

@media screen and (max-width: 768px) {
  .navbar-options {
    display: none;
  }

}
</style>
