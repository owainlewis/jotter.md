// Share links carry the document inside the URL fragment (after `#`).
// The fragment never reaches a server, so an anonymous draft stays private to
// whoever holds the link, with zero backend. When server-backed saved docs
// arrive, the same `/d` view can fetch by id instead of decoding the fragment.

export function encodeDoc(markdown: string): string {
  const bytes = new TextEncoder().encode(markdown);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeDoc(encoded: string): string {
  const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(base64);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
