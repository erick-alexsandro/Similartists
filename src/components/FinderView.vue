<script setup>
import { ref, onMounted } from "vue";
const apiKey = import.meta.env.VITE_LASTFM_API_KEY;
const artistName = ref("");
const artistTitle = ref("");
const artistImage = ref("");
const artistDescription = ref("");
const artists = ref([]);

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
    return current.popularity > best.popularity ? current : best;
  }, artists[0]);

  return bestMatch?.images[0]?.url;
};

const isSearching = ref(false);
const isInputHiding = ref(false);

const search = async () => {
  if (isSearching.value) return; 

  isSearching.value = true;
  isInputHiding.value = true;

  const apiUrl = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName.value}&api_key=${apiKey}&format=json`;

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
  }
};

const getArtistDescription = async (artistName) => {
  const apiUrl = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${artistName}&api_key=${apiKey}&format=json`;

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
  const apiUrl = `http://ws.audioscrobbler.com/2.0/?method=artist.getsimilar&artist=${artistName.value}&api_key=${apiKey}&format=json`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    artists.value = [];
    for (let i = 0; i < 10; i++) {
      const artist = data.similarartists.artist[i];
      const imageUrl = await getArtistImage(artist.name);
      const artistDescription = await getArtistDescription(artist.name);
      const artistUrl = await getArtistUrl(artist.name);
      artists.value.push({
        name: artist.name,
        image: imageUrl,
        description: artistDescription,
        link: artistUrl,
      });
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

onMounted(async () => {
  await getSpotifyToken();
});
</script>

<template>
  <div class="page">
    <div 
  v-if="artists.length === 0"
  class="finder-input-container"
>
  <div
    class="input-finder"
    :class="{ hiding: isInputHiding }"
  >
    <input
      @keyup.enter="search"
      v-model="artistName"
      type="text"
      placeholder="Search for an artist or album"
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
  </div>
</template>

<style scoped>
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
  border: 1px solid #000;
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
  border: 1px solid #000;
}

.artist-card {
  display: flex;
  flex-direction: column;
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
  content: '';
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
  width: 100%;
  padding: 10px;
  border: 1px solid #000;
  border-radius: 25px;
  font-size: 13px;
  font-family: ArgentumSans-Light, sans-serif;
  text-align: center;
}

.input-finder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;
  transform-origin: center;
  opacity: 1;
  transform: translateY(0);
}

.input-finder.hiding {
  opacity: 0;
  transform: translateY(-50px);
}

.searched-artist {
  border-right: 1px solid #000;
  height: 100vh;
  position: fixed;
  width: 50%;
  left: 0;
  top: 0;
  padding-top: 8rem;
}

</style>
