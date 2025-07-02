export const getDomainName = (url) => {
  // Remove protocol (http, https, etc.) and "www."
  let domain = url.replace(/(^\w+:|^)\/\//, "").replace(/^www\./, "");
  // Extract the main domain and suffix
  domain = domain.split("/")[0];
  return domain;
};

export const fetchSpotifyRequestMock = (props) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(props), 300);
  });
};

export const msToMinutesSeconds = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

// Universal function for Spotify Web API
// endpoint - relative path, e.g. '/me/player/play'
// method — 'PUT', 'POST', 'GET', etc.
// params — object with query parameters (e.g. { state: 'track' })
// body — request body (if needed)
// token — OAuth user token

export async function spotifyApiRequest({
  endpoint,
  method = "GET",
  params = {},
  body = null,
  token,
}) {
  const baseUrl = "https://api.spotify.com/v1";
  let url = baseUrl + endpoint;
  const query = new URLSearchParams(params).toString();
  if (query) url += `?${query}`;
  const options = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`Spotify API error: ${res.status}`);
  if (res.status !== 204) return res.json();
  return null;
}

export function extractUsernameFromToken(token) {
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const username =
      payload.unique_name ||
      payload.name ||
      payload.sub ||
      payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];
    return username || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}
