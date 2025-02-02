<script setup>
import { ref, onMounted } from "vue";
const apiKey = import.meta.env.VITE_LASTFM_API_KEY;
const artistName = ref("");
const artistTitle = ref("");
const artistImage = ref("");
const artistDescription = ref("");
const artists = ref([]);
const isLoading = ref(false);

const spotifyClientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const spotifyClientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;
const spotifyToken = ref("");

const getSpotifyToken = async () => {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: spotifyClientId,
      client_secret: spotifyClientSecret,
    }),
  });
  const data = await response.json();
  spotifyToken.value = data.access_token;
};

const getArtistUrl = async (artistName) => {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      artistName
    )}&type=artist&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${spotifyToken.value}`,
      },
    }
  );
  const data = await response.json();

  const artists = data.artists.items;
  const bestMatch = artists.reduce((best, current) => {
    const currentNameMatch =
      current.name.toLowerCase() === artistName.toLowerCase();
    const bestNameMatch = best.name.toLowerCase() === artistName.toLowerCase();

    if (currentNameMatch && !bestNameMatch) return current;
    if (bestNameMatch && !currentNameMatch) return best;
    return current.popularity > best.popularity ? current : best;
  }, artists[0]);
  return bestMatch.external_urls.spotify;
};

const getArtistImage = async (artistName) => {
  const response = await fetch(
    `https://api.spotify.com/v1/search?q=${encodeURIComponent(
      artistName
    )}&type=artist&limit=10`,
    {
      headers: {
        Authorization: `Bearer ${spotifyToken.value}`,
      },
    }
  );
  const data = await response.json();

  const artists = data.artists.items;
  const bestMatch = artists.reduce((best, current) => {
    const currentNameMatch =
      current.name.toLowerCase() === artistName.toLowerCase();
    const bestNameMatch = best.name.toLowerCase() === artistName.toLowerCase();

    if (currentNameMatch && !bestNameMatch) return current;
    if (bestNameMatch && !currentNameMatch) return best;

    if (!currentNameMatch && !bestNameMatch) {
      return current.popularity > best.popularity ? current : best;
    }

    return best;
  }, artists[0]);

  return bestMatch?.images[0]?.url;
};

const isSearching = ref(false);
const isInputHiding = ref(false);

const search = async () => {
  if (isSearching.value) return;

  isLoading.value = true;
  isSearching.value = true;
  isInputHiding.value = true;

  const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName.value}&api_key=${apiKey}&format=json`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    artists.value = [];
    artistTitle.value = data.artist.name;
    artistImage.value = await getArtistImage(artistName.value);
    artistDescription.value = data.artist.bio.summary.split('<a href="')[0];

    await searchSimilars();
  } catch (error) {
    console.error("Error:", error);
  } finally {
    isSearching.value = false;
    isInputHiding.value = false;
    isLoading.value = false;
  }
};

const getArtistDescription = async (artistName) => {
  const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName}&api_key=${apiKey}&format=json`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    const cleanDescription = data.artist.bio.summary.split('<a href="')[0];
    return cleanDescription;
  } catch (error) {
    console.error("Error:", error);
  }
};

const searchSimilars = async () => {
  const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${artistName.value}&api_key=${apiKey}&format=json`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    artists.value = [];

    const processArtists = async (artistList, limit = 10) => {
      const processedArtists = await Promise.all(
        artistList.slice(0, limit).map(async (artist) => {
          const [imageUrl, artistDescription, artistUrl] = await Promise.all([
            getArtistImage(artist.name),
            getArtistDescription(artist.name),
            getArtistUrl(artist.name),
          ]);

          return {
            name: artist.name,
            image: imageUrl,
            description: artistDescription,
            link: artistUrl,
          };
        })
      );
      artists.value = processedArtists;
    };

    if (data.similarartists.artist.length === 0) {
      // const artistIdUrl = `https://api.deezer.com/search/artist?q=${artistName.value}`;
      // const artistResponse = await fetch(artistIdUrl);
      // const artistData = await artistResponse.json();
      // const artistId = artistData.data[0].id;
      // const similarUrl = `https://api.deezer.com/artist/${artistId}/related`;
      // const similarResponse = await fetch(similarUrl);
      // const similarData = await similarResponse.json();
      // await processArtists(similarData.data);
      const message = `No similar artists found for ${artistName.value}`;
      alert(message);
    } else {
      await processArtists(data.similarartists.artist);
    }
  } catch (error) {
    console.error("Error fetching similar artists:", error);
    artists.value = []; // Reset on error
  }
};

onMounted(async () => {
  await getSpotifyToken();
});
</script>

<template>
  <div class="page">
    <div v-if="artists.length === 0" class="finder-input-container">
      <div class="input-finder" :class="{ hiding: isInputHiding }">
        <input
          @keyup.enter="search"
          v-model="artistName"
          type="text"
          placeholder="Search for an artist"
          :disabled="isSearching"
        />
      </div>
    </div>
    <div class="finder-page">
      <div v-if="artists.length > 5" class="finder-result">
        <div class="searched-artist">
          <div class="finder-searched-container">
            <img
              :src="artistImage"
              alt="artist-image"
              class="finder-artist-image"
            />
            <h1 class="finder-artist-title">{{ artistTitle }}</h1>
            <p class="finder-artist-description">{{ artistDescription }}</p>
          </div>
        </div>
        <div class="finder-result-artists">
          <div v-for="artist in artists" :key="artist.name" class="artist-card">
            <a :href="artist.link" target="_blank"
              ><div class="artist-single-card">
                <img
                  :src="artist.image"
                  :alt="artist.name"
                  class="artist-image"
                />
                <div class="artist-info">
                  <h3>{{ artist.name }}</h3>
                  <p>{{ artist.description }}</p>
                </div>
              </div></a
            >
          </div>
        </div>
      </div>
    </div>
    <div v-if="isLoading" class="finder-result">
      <div class="searched-artist">
        <div class="finder-searched-container">
          <div class="skeleton finder-artist-image"></div>
          <div class="skeleton finder-artist-title"></div>
          <div class="skeleton finder-artist-description"></div>
        </div>
      </div>
      <div class="finder-result-artists">
        <div v-for="n in 10" :key="n" class="artist-card">
          <div class="artist-single-card">
            <div class="skeleton artist-image"></div>
            <div class="artist-info">
              <div class="skeleton artist-title"></div>
              <div class="skeleton artist-description"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton {
  background-color: #f0f0f0;
  animation: colorPulse 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.skeleton.finder-artist-image {
  width: 400px;
  height: 400px;
  transition: all 0.5s ease-in-out;
}

.skeleton.finder-artist-title {
  width: 80%;
  height: 50px;
  margin: 20px 0;
  transition: all 0.5s ease-in-out;
}

.skeleton.finder-artist-description {
  width: 100%;
  height: 300px;
  transition: all 0.5s ease-in-out;
}

.skeleton.artist-image {
  width: 100px;
  height: 100px;
  transition: all 0.5s ease-in-out;
}

.skeleton.artist-title {
  width: 150px;
  height: 24px;
  margin-bottom: 8px;
  transition: all 0.5s ease-in-out;
}

.skeleton.artist-description {
  width: 500%;
  height: 100px;
  transition: all 0.5s ease-in-out;
}

@keyframes colorPulse {
  0% {
    background-color: #f0f0f0;
  }
  50% {
    background-color: #e0e0e0;
  }
  100% {
    background-color: #f0f0f0;
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.finder-input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
}
.finder-searched-container {
  display: flex;
  flex-direction: column;
  width: 85%;
  margin: 0 auto;
  position: sticky;
  top: 8rem;
}
.finder-artist-image {
  width: 400px;
  height: 400px;
  object-fit: cover;
  border-radius: 15px;
  border: 3px solid var(--main-text);
}
.finder-artist-title {
  font-family: ArgentumSans-Black, sans-serif;
  font-size: 2rem;
}
.finder-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 8rem;
  height: auto;
}

.finder-result-artists {
  display: flex;
  flex-direction: column;
  width: 50%;
  margin-left: auto;
  padding-left: 2rem;
  transition: all 0.5s ease-in-out;
}

.finder-result {
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  min-height: calc(100vh - 8rem);
}

.artist-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  min-width: 100px;
  min-height: 100px;
  max-width: 100px;
  max-height: 100px;
  border: 3px solid var(--main-text);
}

.artist-card {
  display: flex;
  flex-direction: column;
  animation: slideIn 0.5s ease-out backwards;
  animation-delay: calc(var(--i, 0) * 0.1s);
}

.artist-single-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin: 0 10px;
  padding: 15px 30px;
  cursor: pointer;
}

.artist-info h3 {
  font-family: ArgentumSans-Bold, sans-serif;
  font-size: 1rem;
  position: relative;
  display: inline-block;
}

.artist-info h3::after {
  content: "";
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background-color: #000;
  transition: width 0.3s ease;
}

.artist-single-card:hover .artist-info h3::after {
  width: 100%;
}

.artist-info p {
  font-family: ArgentumSans-Light, sans-serif;
  font-size: 0.9rem;
}

.finder-artist-description {
  font-family: ArgentumSans-Light, sans-serif;
  font-size: 1rem;
  margin-top: 10px;
}

.input-finder input {
  width: 100vw;
  height: 100vh;
  border: 1px solid var(--main-text);
  font-size: 5rem;
  font-family: ArgentumSans-Light, sans-serif;
  text-align: left;
  padding-left: 15rem;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
}

.input-finder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform-origin: center;
  opacity: 1;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.input-finder.hiding {
  opacity: 0;
}

.searched-artist {
  border-right: 3px solid var(--main-text);
  height: 100vh;
  position: fixed;
  width: 50%;
  left: 0;
  top: 0;
  padding-top: 8rem;
}

@media screen and (max-width: 1470px) {
  .searched-artist {
    width: 90%;
    border-right: none;
    border-bottom: 2px solid var(--main-text);
    height: auto;
    position: relative;
    padding-top: 0;
  }

  .finder-searched-container {
    position: relative;
    top: 0;
    padding: 20px;
  }

  .finder-result {
    flex-direction: column;
    animation: fadeIn 0.8s ease-out;
  }

  .finder-result-artists {
    width: 100%;
    padding: 0;
    margin: 0;
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .artist-single-card {
    margin: 10px;
    padding: 10px;
  }

  .finder-searched-container {
    width: 100%;
  }

  .input-finder input {
    text-align: center;
    padding-left: 0;
  }
}

@media screen and (max-width: 768px) {
  .artist-single-card {
    flex-direction: column;
    align-items: start;
  }

  .input-finder input {
    font-size: 2rem;
    padding-left: 0;
    text-align: center;
  }

  .finder-artist-image {
    width: 80vw;
    height: 80vw;
  }
  .skeleton.artist-image {
    width: 80vw;
    height: 80vw;
  }

  .finder-result-artists {
    width: 100%;
    padding: 0;
    margin: 0;
  }

  .artist-card {
    width: 100%;
  }

  .artist-single-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .artist-info {
    text-align: center;
  }

  .finder-searched-container {
    width: 100%;
    padding: 10px;
  }

  .finder-artist-title {
    font-size: 1.5rem;
  }

  .finder-artist-description {
    font-size: 0.9rem;
  }
}
</style>
