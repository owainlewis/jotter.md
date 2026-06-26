"use client";

import { marked } from "marked";
import { useEffect, useMemo, useRef } from "react";

marked.setOptions({ gfm: true, breaks: false });

let mermaidReady = false;

async function loadMermaid() {
  const mermaid = (await import("mermaid")).default;
  if (!mermaidReady) {
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "neutral",
      fontFamily: "var(--font-sans), system-ui, sans-serif"
    });
    mermaidReady = true;
  }
  return mermaid;
}

export function MarkdownView({ source }: { source: string }) {
  const ref = useRef<HTMLElement>(null);
  const html = useMemo(() => marked.parse(source) as string, [source]);

  // Render fenced ```mermaid blocks into diagrams once the HTML is in the DOM.
  // React owns this subtree via dangerouslySetInnerHTML and may swap nodes on
  // re-render, so we re-query the live DOM each pass instead of holding refs.
  useEffect(() => {
    const root = ref.current;
    if (!root || !root.querySelector("code.language-mermaid")) return;

    let cancelled = false;
    (async () => {
      let mermaid: Awaited<ReturnType<typeof loadMermaid>>;
      try {
        mermaid = await loadMermaid();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        root.querySelectorAll("code.language-mermaid").forEach((block) => {
          const pre = block.closest("pre");
          if (pre) replaceWithError(pre, `Diagram engine failed to load: ${message}`);
        });
        return;
      }

      let pass = 0;
      let block = root.querySelector<HTMLElement>("code.language-mermaid");
      while (block && !cancelled && pass < 100) {
        pass += 1;
        const pre = block.closest("pre");
        if (!pre) break;
        const code = block.textContent ?? "";
        const id = `mmd-${Math.random().toString(36).slice(2)}-${pass}`;
        try {
          const { svg } = await mermaid.render(id, code);
          if (cancelled) return;
          if (pre.isConnected) {
            const figure = document.createElement("figure");
            figure.className = "mermaidFigure";
            figure.innerHTML = svg;
            pre.replaceWith(figure);
          }
        } catch (err) {
          if (cancelled) return;
          if (pre.isConnected) {
            replaceWithError(pre, err instanceof Error ? err.message : String(err));
          }
          document.getElementById(id)?.remove();
        }
        block = root.querySelector<HTMLElement>("code.language-mermaid");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [html]);

  return <article ref={ref} className="markdown" dangerouslySetInnerHTML={{ __html: html }} />;
}

function replaceWithError(pre: Element, message: string) {
  const box = document.createElement("div");
  box.className = "mermaidError";
  box.textContent = message;
  pre.replaceWith(box);
}
