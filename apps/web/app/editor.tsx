"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { snippetOf, titleOf, wordCount } from "./doc-utils";
import { MarkdownView } from "./markdown-view";
import { encodeDoc } from "./share";

type Doc = {
  id: string;
  body: string;
};

type Mode = "edit" | "preview";

const STORAGE_KEY = "jotter.documents.v2";
const ACTIVE_KEY = "jotter.active.v2";

const welcomeBody = `# Markdown for agents and humans

Write here. Everything stays in this browser until you choose to save it.
Press **Cmd + R** (or **Ctrl + R**) to switch between editing and the rendered
document.

## Why jotter

- A calm, almost empty writing surface.
- A preview that reads like a finished document.
- Plain Markdown in, plain Markdown out, so agents can read and write it too.

## Markdown that looks the part

Inline \`code\`, **bold**, and *italic* all render cleanly. Links like
[jotter.md](https://jotter.md) pick up the accent color.

> The best tool for thinking in Markdown should disappear while you write.

\`\`\`ts
export function greet(name: string) {
  return \`Hello, ${"${name}"}\`;
}
\`\`\`

## Diagrams

Fenced \`mermaid\` blocks render as diagrams.

\`\`\`mermaid
flowchart LR
  Write([Write Markdown]) --> Preview([Preview])
  Preview --> Share([Share link])
  Preview --> Export([Export .md])
\`\`\`

| Surface | Audience |
| ------- | -------- |
| Browser | Humans   |
| CLI     | Agents   |

Start a new document any time with the **+** button in the sidebar.
`;

function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `doc-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function seedDocs(): Doc[] {
  return [{ id: "welcome", body: welcomeBody }];
}

function SidebarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="9.5" y1="4" x2="9.5" y2="20" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
      <path
        d="M6 3.5h7L18 8v12a.5.5 0 0 1-.5.5h-11A.5.5 0 0 1 6 20V4a.5.5 0 0 1 .5-.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="M13 3.5V8h4.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function Editor() {
  const [docs, setDocs] = useState<Doc[]>(seedDocs);
  const [activeId, setActiveId] = useState<string>("welcome");
  const [mode, setMode] = useState<Mode>("edit");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const copyTimer = useRef<number | undefined>(undefined);

  // Load persisted state after mount so SSR and the first client render match.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const storedActive = localStorage.getItem(ACTIVE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Doc[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Reading localStorage must happen after mount to avoid a hydration
          // mismatch, so this one-time sync from storage is intentional.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setDocs(parsed);
          setActiveId(storedActive && parsed.some((d) => d.id === storedActive) ? storedActive : parsed[0].id);
        }
      }
    } catch {
      // Ignore corrupt storage and keep the seeded document.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
      localStorage.setItem(ACTIVE_KEY, activeId);
    } catch {
      // Storage may be unavailable (private mode); drafts stay in memory.
    }
  }, [docs, activeId, hydrated]);

  const active = docs.find((d) => d.id === activeId) ?? docs[0];

  // Grow the textarea with its content so the pane scrolls as one surface.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el || mode !== "edit") return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [active.body, mode, activeId]);

  const toggleMode = useCallback(() => {
    setMode((m) => (m === "edit" ? "preview" : "edit"));
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "r") {
        e.preventDefault();
        toggleMode();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleMode]);

  function updateBody(body: string) {
    setDocs((prev) => prev.map((d) => (d.id === active.id ? { ...d, body } : d)));
  }

  function createDoc() {
    const doc = { id: newId(), body: "" };
    setDocs((prev) => [doc, ...prev]);
    setActiveId(doc.id);
    setMode("edit");
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function deleteDoc(id: string) {
    setDocs((prev) => {
      const next = prev.filter((d) => d.id !== id);
      const remaining = next.length > 0 ? next : seedDocs();
      if (id === activeId) setActiveId(remaining[0].id);
      return remaining;
    });
  }

  function exportDoc() {
    const blob = new Blob([active.body], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${titleOf(active.body).replace(/[^\w.-]+/g, "-").toLowerCase() || "untitled"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function shareDoc() {
    const url = `${window.location.origin}/d#${encodeDoc(active.body)}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this share link", url);
    }
    setCopied(true);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 1800);
  }

  const words = wordCount(active.body);
  const title = titleOf(active.body);

  return (
    <div className={`workspace ${sidebarOpen ? "withSidebar" : ""}`}>
      <aside className="sidebar" aria-label="Documents" data-open={sidebarOpen}>
        <div className="sidebarHead">
          <span className="brand">
            <span className="brandMark" aria-hidden="true">
              J
            </span>
            <span className="brandName">
              jotter<span className="brandExt">.md</span>
            </span>
          </span>
        </div>
        <div className="docListLabel">
          <span>Documents</span>
          <span className="docCount">{docs.length}</span>
        </div>
        <nav className="docList">
          {docs.map((doc) => {
            const isActive = doc.id === active.id;
            return (
              <button
                key={doc.id}
                type="button"
                className={`docRow ${isActive ? "active" : ""}`}
                onClick={() => setActiveId(doc.id)}
              >
                <span className="docRowIcon">
                  <DocIcon />
                </span>
                <span className="docRowText">
                  <span className="docRowTitle">{titleOf(doc.body)}</span>
                  <span className="docRowSnippet">{snippetOf(doc.body)}</span>
                </span>
                {docs.length > 1 && (
                  <span
                    className="docRowDelete"
                    role="button"
                    tabIndex={-1}
                    aria-label="Delete document"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteDoc(doc.id);
                    }}
                  >
                    ×
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="main">
        <header className="topBar">
          <div className="topCluster">
            <button
              type="button"
              className="iconButton"
              aria-label={sidebarOpen ? "Hide sidebar" : "Show sidebar"}
              aria-pressed={sidebarOpen}
              onClick={() => setSidebarOpen((v) => !v)}
            >
              <SidebarIcon />
            </button>
            <button type="button" className="iconButton" aria-label="New document" onClick={createDoc}>
              <PlusIcon />
            </button>
          </div>

          <h1 className="docTitle" title={title}>
            {title}
          </h1>

          <div className="topCluster end">
            <div className="modeToggle" role="group" aria-label="View mode">
              <button
                type="button"
                className={mode === "edit" ? "on" : ""}
                aria-pressed={mode === "edit"}
                onClick={() => setMode("edit")}
              >
                Edit
              </button>
              <button
                type="button"
                className={mode === "preview" ? "on" : ""}
                aria-pressed={mode === "preview"}
                onClick={() => setMode("preview")}
              >
                Preview
              </button>
            </div>
            <button type="button" className="textButton" onClick={shareDoc}>
              {copied ? "Copied" : "Share"}
            </button>
            <button type="button" className="textButton" onClick={exportDoc}>
              Export
            </button>
          </div>
        </header>

        <section className="writingPane" aria-label="Markdown editor">
          {mode === "edit" ? (
            <textarea
              ref={textareaRef}
              className="editor"
              aria-label="Markdown editor"
              aria-multiline="true"
              spellCheck
              placeholder="Start writing Markdown."
              value={active.body}
              onChange={(e) => updateBody(e.target.value)}
            />
          ) : (
            <MarkdownView source={active.body} />
          )}
        </section>

        <footer className="statusBar" aria-label="Editor status">
          <span className="statusMode">{mode === "edit" ? "Editing" : "Preview"}</span>
          <span className="statusWords">{words === 1 ? "1 word" : `${words} words`}</span>
          <span className="statusSave">
            <span className="saveDot" aria-hidden="true" />
            Saved locally
          </span>
        </footer>
      </div>
    </div>
  );
}
