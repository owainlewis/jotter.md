export function titleOf(body: string): string {
  for (const raw of body.split("\n")) {
    const line = raw.trim();
    if (!line) continue;
    return line.replace(/^#{1,6}\s+/, "").replace(/[*_`>#-]/g, "").trim() || "Untitled";
  }
  return "Untitled";
}

export function snippetOf(body: string): string {
  const lines = body.split("\n").map((l) => l.trim());
  const titleSeen = lines.findIndex((l) => l.length > 0);
  for (let i = titleSeen + 1; i < lines.length; i++) {
    if (lines[i]) return lines[i].replace(/^#{1,6}\s+/, "").replace(/[*_`>#]/g, "").trim();
  }
  return "No additional text";
}

export function wordCount(body: string): number {
  const words = body.trim().match(/\S+/g);
  return words ? words.length : 0;
}
