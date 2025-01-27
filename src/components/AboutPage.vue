<script setup>
import { ref } from "vue";

const isVideoLoading = ref(true);

const handleVideoLoaded = () => {
  isVideoLoading.value = false;
};
</script>

<template>
  <div class="page-whole-about">
    <div class="about-landing-page" id="about">
      <div class="about-img-landing">
        <div class="video-section">
          <div class="video-container">
            <div v-if="isVideoLoading" class="video-skeleton"></div>
            <video
              class="about-video"
              autoplay
              loop
              muted
              @loadeddata="handleVideoLoaded"
              :class="{ hidden: isVideoLoading }"
            >
              <source src="../assets/Similartists.mp4" type="video/mp4" />
            </video>
            <div v-if="!isVideoLoading" class="noise-overlay"></div>
          </div>
        </div>
        <div class="about-img-text">
          <h1>About</h1>
          <div class="about-img-paragraph">
            <p>
              This project was made by Eric Alex with the purpose of learning
              more about and how to use the Last.fm API and Spotify API. It was
              made using Vue 3, Vue Router and Vite.
            </p>
            <br /><br />
            <p>
              It basically uses these APIs to get artists that are
              similar to the ones you search for. This way you can find new
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
.noise-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url("../assets/noise.png") repeat;
  opacity: 0.8; 
  animation: noise 0.2s steps(8) infinite; 
  pointer-events: none; 
}

@keyframes noise {
  0%,
  100% {
    transform: translate(0, 0);
  }
  10% {
    transform: translate(-1%, -1%);
  }
  20% {
    transform: translate(1%, 1%);
  }
  30% {
    transform: translate(-2%, 2%);
  }
  40% {
    transform: translate(3%, -3%);
  }
  50% {
    transform: translate(-3%, 3%);
  }
  60% {
    transform: translate(4%, 1%);
  }
  70% {
    transform: translate(-4%, -2%);
  }
  80% {
    transform: translate(2%, 4%);
  }
  90% {
    transform: translate(-3%, -3%);
  }
}

.video-container {
  position: relative;
  width: 1000px;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.video-skeleton {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border: 3px solid var(--main-text);
}


.video-section {
  border: 3px solid var(--main-text);
  width: 1000px;
  aspect-ratio: 16/9;
}

.hidden {
  opacity: 0;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.about-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}
.about-landing-page {
  display: flex;
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
.about-img-landing p,
.about-text p {
  font-family: ArgentumSans-Light, sans-serif;
  font-size: 1.7rem;
}

.about-img-text p {
  margin-top: -30px;
}

@media screen and (max-width: 1680px) {
  .about-img-landing {
    flex-direction: column;
  }
}

@media screen and (max-width: 768px) {
  .page-whole-about {
    padding: 1rem;
  }

  .video-container,
  .video-section,
  .about-video {
    width: 100%;
    height: auto;
  }

  .about-img-landing {
    gap: 1rem;
  }

  .about-img-landing h1 {
    font-size: 3rem;
    text-align: center;
  }

  .about-img-landing p,
  .about-text p {
    font-size: 1.2rem;
    text-align: justify;
    padding: 0 1rem;
  }

  .about-img-text p {
    margin-top: -15px;
  }

  .video-skeleton {
    height: 56.25vw; /* 16:9 aspect ratio */
  }
}

@media screen and (max-width: 480px) {
  .about-img-landing h1 {
    font-size: 2.5rem;
  }

  .about-img-landing p,
  .about-text p {
    font-size: 1rem;
  }
}

</style>
