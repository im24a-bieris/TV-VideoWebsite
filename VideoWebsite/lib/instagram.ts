export function getInstagramUrl(username: string) {
  const normalizedUsername = username.trim().replace(/^@+/, "");

  return normalizedUsername ? `https://www.instagram.com/${encodeURIComponent(normalizedUsername)}` : null;
}