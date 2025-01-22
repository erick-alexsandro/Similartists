<script setup>
import MagnifyIcon from "./icons/MagnifyIcon.vue";
</script>

<template>
  <div class="page">
    <div class="about-landing-page" id="about">
      <div class="about-img-landing">
        <img src="../assets/spotify.jpeg" alt="check-artists-out" />
        <div class="about-img-text">
          <h1>About</h1>
          <div class="about-img-paragraph">
            <p>
              This project was made by Eric Alex with the purpose of learning more about the
              Last.fm API and how to use it in a real-world project. It was made
              using Vue 3, Vue Router and Vite.
            </p>
            <br /><br />
            <p>
              It basically uses the amazing API to get artists and albums that
              are similar to the ones you search for. This way you can find new
              artists and albums that you might like and expand your music
              taste. Maybe even share them with your friends.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="about-text">
      <p>
        The project is still in development, so there are still some bugs and
        missing features. If you find any bugs or have any suggestions, please
        let me know.
      </p>
    </div>
  </div>
</template>

<style scoped>
.about-landing-page {
  display: flex;
  /* max-width: 1700px; */
}

.about-img-landing img {
  border: 1px solid #000;
  border-radius: 10px;
  width: 900px;
  height: auto;
  max-height: 500px;
}
.about-img-landing {
  display: flex;
  gap: 2rem;
}
.about-img-landing h1 {
  font-family: ArgentumSans-Bold, sans-serif;
  font-size: 5rem;
  line-height: 0.9;
  margin-top: 0;
}
.about-img-landing p, .about-text p {
  font-family: ArgentumSans-Light, sans-serif;
  font-size: 1.7rem;
}

.about-img-text p {
  margin-top: -30px;
}
</style>
