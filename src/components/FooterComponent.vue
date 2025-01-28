<script setup>
import ArrowBox from "./icons/ArrowBox.vue";
</script>

<template>
  <div class="footer">
    <div class="footer-content">
      <div class="footer-title">
        <div class="footer-title-component">
          <h1>Similartists</h1>
          <a href="mailto:contatoerickalexsandro@gmail.com" class="mail-link"
            ><p class="make-contact">Make contact <ArrowBox /></p
          ></a>
        </div>
        <div class="footer-links">
          <div class="dev-menu">
            <p>Made by Eric Alex</p>
          </div>
          <div class="menu">
            <div class="menu-item">
              <p>Check other projects</p>
              <a href="https://github.com/erick-alexsandro" target="_blank"
                >Github</a
              >
            </div>
            <div class="menu-item">
              <p>See my profile</p>
              <a
                href="https://www.linkedin.com/in/erick-alexsandro/"
                target="_blank"
                >LinkedIn</a
              >
            </div>
            <div class="menu-item">
              <p>Contact me through email</p>
              <a href="mailto:contatoerickalexsandro@gmail.com">Contact me</a>
            </div>
            <div class="menu-item">
              <p>See my portfolio</p>
              <a href="https://ericalex.vercel.app/">Eric Alex's Portfolio</a>
            </div>
            <div class="menu-item">
              <p>See the repositoy</p>
              <a href="https://github.com/erick-alexsandro/Similartists"
                >Github Repository</a
              >
            </div>
          </div>
        </div>
      </div>
      <div class="footer-copy">
        <p>© {{ new Date().getFullYear() }} Similartists</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.menu-item {
  display: flex;
  flex-direction: column;
}

.menu-item p {
  margin: 0;
  color: var(--gray);
  font-family: ArgentumSans-Regular, sans-serif;
}

.make-contact,
.mail-link {
  font-size: 2rem;
  margin: 0;
  position: relative;
  width: fit-content;
  display: inline-block;
}
.footer {
  display: flex;
  flex-direction: column;
  padding: 3rem;
  background-color: var(--main-text);
  color: var(--main-bg);
  font-family: ArgentumSans-Light, sans-serif;
  width: 100%;
  bottom: 0;
  position: relative;
  height: 700px;
  z-index: 999999999;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-title {
  display: flex;
  flex-direction: column;
}

.footer-title a {
  text-decoration: none;
  color: var(--main-bg);
  font-size: 1rem;
}

.footer-links {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 5rem;
}

.footer-title h1 {
  font-size: 4rem;
  margin: 0;
}

.footer-content {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 3rem 5rem 0 5rem;
}

.dev-menu p {
  margin: 0;
  padding: 0;
  margin-right: 10px;
}

.footer-links a {
  text-decoration: none;
  color: var(--main-bg);
  font-size: 1rem;
  position: relative;
  width: fit-content;
  display: inline-block;
}

.footer-links a::after,
.mail-link::after {
  content: "";
  position: absolute;
  width: 0;
  height: 1px;
  bottom: -2px;
  left: 0;
  background-color: var(--main-bg);
  transition: width 0.3s ease-in-out;
}

.footer-links a:hover::after,
.mail-link:hover::after {
  width: 100%;
}

@media screen and (max-width: 768px) {
  .footer {
    height: auto;
    padding: 2rem;
  }

  .footer-content {
    flex-direction: column;
    padding: 2rem;
    gap: 2rem;
  }

  .footer-title h1 {
    font-size: 2.5rem;
  }

  .make-contact,
  .mail-link {
    font-size: 1.5rem;
  }

  .footer-links {
    flex-direction: column;
    gap: 2rem;
  }

  .menu {
    gap: 1.5rem;
  }
}

@media screen and (max-width: 480px) {
  .footer-title h1 {
    font-size: 2rem;
  }

  .make-contact,
  .mail-link {
    font-size: 1.2rem;
  }
}
</style>
