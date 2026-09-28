const API_BASE_URL = "https://sidea-sideb.onrender.com/api";

export async function fetchMatchup(artistA, albumA, artistB, albumB) {
  const url = `${API_BASE_URL}/matchup?artist_a=${encodeURIComponent(artistA)}&album_a=${encodeURIComponent(albumA)}&artist_b=${encodeURIComponent(artistB)}&album_b=${encodeURIComponent(albumB)}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to load album matchup data.");
  }
  return await response.json();
}