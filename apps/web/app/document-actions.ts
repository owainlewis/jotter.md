export const MARKDOWN_EXPORT_FILENAME = "jotter-draft.md";

export function createMarkdownExport(markdownSource: string) {
  return {
    blob: new Blob([markdownSource], {
      type: "text/markdown;charset=utf-8"
    }),
    filename: MARKDOWN_EXPORT_FILENAME
  };
}

export function downloadMarkdown(markdownSource: string) {
  const { blob, filename } = createMarkdownExport(markdownSource);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export async function copyMarkdown(markdownSource: string) {
  await navigator.clipboard.writeText(markdownSource);
}
