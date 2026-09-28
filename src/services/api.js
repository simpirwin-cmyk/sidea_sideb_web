const API_BASE_URL = "https://sidea-sideb.onrender.com/api";

export async function fetchMatchup(artistA, albumA, artistB, albumB) {
  const url = `${API_BASE_URL}/matchup?artist_a=${encodeURIComponent(artistA)}&album_a=${encodeURIComponent(albumA)}&artist_b=${encodeURIComponent(artistB)}&album_b=${encodeURIComponent(albumB)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to load album matchup data.");
  }
  return await response.json();
}

// Fetch artist auto-suggestions as the user types
export async function searchArtists(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const response = await fetch(`${API_BASE_URL}/search-artists?q=${encodeURIComponent(query)}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.artists || data; // Handles array or { artists: [...] }
  } catch (err) {
    console.error("Error searching artists:", err);
    return [];
  }
}

// Fetch top albums once an artist is selected
export async function fetchArtistAlbums(artistName) {
  if (!artistName) return [];
  try {
    const response = await fetch(`${API_BASE_URL}/artist-albums?artist=${encodeURIComponent(artistName)}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data.albums || data; // Handles array or { albums: [...] }
  } catch (err) {
    console.error("Error fetching albums:", err);
    return [];
  }
}