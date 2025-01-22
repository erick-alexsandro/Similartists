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

const search = async () => {
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

    searchSimilars();
  } catch (error) {
    console.error("Error:", error);
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
      artists.value.push({
        name: artist.name,
        image: imageUrl,
        description: artistDescription,
        link: artist.url,
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
    <div class="finder-page">
      <div v-if="artists.length === 0" class="input-finder">
        <input
          v-model="artistName"
          type="text"
          placeholder="Search for an artist or album"
        />
        <button @click="search">Search</button>
      </div>
      <div v-if="artists.length > 0" class="finder-result">
        <div class="finder-searched-container">
          <img
            :src="artistImage"
            alt="artist-image"
            class="finder-artist-image"
          />
          <h1 class="finder-artist-title">{{ artistTitle }}</h1>
          <p class="finder-artist-description">{{ artistDescription }}</p>
        </div>
        <div class="finder-result-artists">
          <div v-for="artist in artists" :key="artist.name" class="artist-card">
            <div class="artist-single-card">
              <img
                :src="artist.image"
                :alt="artist.name"
                class="artist-image"
              />
              <div class="artist-info">
                <h3>{{ artist.name }}</h3>
                <p>{{ artist.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.finder-searched-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  margin-bottom: 2rem;
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
}

.finder-result {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.finder-result-artists {
  /* display: grid; */
  /* grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); */
  display: flex;
  flex-direction: column;
  width: 100%;
}

.artist-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
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
  margin: 10px;
  padding: 10px;
  cursor: pointer;
}

.finder-artist-description {
  font-family: ArgentumSans-Light, sans-serif;
  font-size: 1rem;
  margin-top: 10px;
}

/* .finder-result-artists {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: space-around;
  width: 100%;
}

.finder-result-artists p {
  margin: 0;
  padding: 10px;
  border-radius: 4px;
  min-width: 150px;
  text-align: center;
} */
</style>
