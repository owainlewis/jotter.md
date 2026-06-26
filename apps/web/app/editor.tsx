"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { snippetOf, titleOf, wordCount } from "./doc-utils";
import { useEntitlements } from "./entitlements";
import { MarkdownView } from "./markdown-view";
import { encodeDoc } from "./share";

type Theme = "light" | "dark";
const THEME_KEY = "jotter.theme.v1";

type Doc = {
  id: string;
  body: string;
  pinned?: boolean;
};

type Mode = "edit" | "preview";

const STORAGE_KEY = "jotter.documents.v2";
const ACTIVE_KEY = "jotter.active.v2";

const welcomeBody = `# Markdown for agents and humans

Welcome to jotter. This is your sample document and quick guide.
It is pinned, so it stays at the top, and pinned documents cannot be deleted until you unpin them.

## Writing

Just start typing. Everything is saved locally in this browser until you choose to share or export it.

Press **Cmd + R** (or **Ctrl + R**) to switch between **Edit** and **Preview**.
Edit shows raw Markdown. Preview reads like a finished document.

## Your documents

- The sidebar lists every document. Create a new one with the **+** button.
- Use the **Filter** box to find a document by its title or text.
- **Pin** a document to float it to the top. Pinned documents are protected, so to delete one you unpin it first. Try unpinning this guide to reveal its delete button.

## Sharing and export

- **Share** copies a private link. The document travels inside the link, so only people you send it to can read it.
- **Export** downloads the raw \`.md\` file.

## A finished document

Inline \`code\`, **bold**, and *italic* all render cleanly. Links like [jotter.md](https://jotter.md) pick up the accent color.

> The best tool for thinking in Markdown should disappear while you write.

\`\`\`ts
export function greet(name: string) {
  return \`Hello, ${"${name}"}\`;
}
\`\`\`

Diagrams render from fenced \`mermaid\` blocks:

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

Dark mode lives in the account menu and is part of jotter Pro.
`;

function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `doc-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function seedDocs(): Doc[] {
  return [{ id: "welcome", body: welcomeBody, pinned: true }];
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

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="6.25" stroke="currentColor" strokeWidth="1.6" />
      <line x1="15.6" y1="15.6" x2="20" y2="20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PinIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="13"
      height="13"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M9 4.5h6l-1 4.6 2.6 2.9V13.4H7.4v-1.4L10 9.1 9 4.5Z" strokeLinejoin="round" />
      <line x1="12" y1="13.4" x2="12" y2="19.5" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <circle cx="12" cy="8.5" r="3.4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.5 19.5a6.5 6.5 0 0 1 13 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function Editor() {
  const [docs, setDocs] = useState<Doc[]>(seedDocs);
  const [activeId, setActiveId] = useState<string>("welcome");
  const [mode, setMode] = useState<Mode>("edit");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [theme, setTheme] = useState<Theme>("light");
  const [hydrated, setHydrated] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const copyTimer = useRef<number | undefined>(undefined);

  const { plan, setPlan, can } = useEntitlements();
  const canDark = can("darkMode");
  const darkActive = canDark && theme === "dark";

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

  // Hydrate the saved theme preference after mount.
  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTheme(stored);
    }
  }, []);

  // Apply dark mode to the document only when the plan entitles it.
  useEffect(() => {
    const root = document.documentElement;
    if (darkActive) {
      root.dataset.theme = "dark";
    } else {
      delete root.dataset.theme;
    }
  }, [darkActive]);

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
    setFilter("");
    requestAnimationFrame(() => textareaRef.current?.focus());
  }

  function togglePin(id: string) {
    setDocs((prev) => prev.map((d) => (d.id === id ? { ...d, pinned: !d.pinned } : d)));
  }

  function deleteDoc(id: string) {
    // Pinned documents are protected from deletion; unpin first to remove one.
    if (docs.find((d) => d.id === id)?.pinned) return;
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
    const url = `${window.location.origin}/d#${await encodeDoc(active.body)}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this share link", url);
    }
    setCopied(true);
    window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 1800);
  }

  function toggleDarkMode() {
    if (!canDark) return;
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Storage may be unavailable; the choice stays in memory for this session.
    }
  }

  const words = wordCount(active.body);
  const title = titleOf(active.body);

  // Naive in-memory filter over title and body, with pinned docs floated up.
  // Array.sort is stable, so unpinned docs keep their existing order.
  const query = filter.trim().toLowerCase();
  const visibleDocs = docs
    .filter((d) => !query || titleOf(d.body).toLowerCase().includes(query) || d.body.toLowerCase().includes(query))
    .slice()
    .sort((a, b) => Number(Boolean(b.pinned)) - Number(Boolean(a.pinned)));

  return (
    <div className={`workspace ${sidebarOpen ? "withSidebar" : ""}`}>
      <aside className="sidebar" aria-label="Documents" data-open={sidebarOpen}>
        <div className="sidebarHead">
          <Link className="brand" href="/" aria-label="jotter.md home">
            <span className="brandMark" aria-hidden="true">
              J
            </span>
            <span className="brandName">
              jotter<span className="brandExt">.md</span>
            </span>
          </Link>
        </div>
        <div className="filterRow">
          <div className="filterField">
            <span className="filterIcon">
              <SearchIcon />
            </span>
            <input
              className="filterInput"
              type="text"
              placeholder="Filter"
              aria-label="Filter documents"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
        <div className="docListLabel">
          <span>Documents</span>
          <span className="docCount">{docs.length}</span>
        </div>
        <nav className="docList">
          {visibleDocs.map((doc) => {
            const isActive = doc.id === active.id;
            return (
              <button
                key={doc.id}
                type="button"
                className={`docRow ${isActive ? "active" : ""} ${doc.pinned ? "pinned" : ""}`}
                onClick={() => setActiveId(doc.id)}
              >
                <span className="docRowIcon">
                  <DocIcon />
                </span>
                <span className="docRowText">
                  <span className="docRowTitle">{titleOf(doc.body)}</span>
                  <span className="docRowSnippet">{snippetOf(doc.body)}</span>
                </span>
                <span className="docRowActions">
                  <span
                    className="docRowPin"
                    role="button"
                    tabIndex={-1}
                    aria-label={doc.pinned ? "Unpin document" : "Pin document"}
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePin(doc.id);
                    }}
                  >
                    <PinIcon filled={Boolean(doc.pinned)} />
                  </span>
                  {docs.length > 1 && !doc.pinned && (
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
                </span>
              </button>
            );
          })}
          {visibleDocs.length === 0 && <p className="docListEmpty">No documents match.</p>}
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
            <div className="userMenuWrap">
              <button
                type="button"
                className="iconButton userButton"
                aria-label="Account"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
              >
                <UserIcon />
              </button>
              {menuOpen && (
                <>
                  <div className="menuOverlay" onClick={() => setMenuOpen(false)} aria-hidden="true" />
                  <div className="userMenu" role="menu">
                    <div className="menuRow">
                      <span className="menuRowLabel">
                        Dark mode
                        {!canDark && <span className="proPill">Pro</span>}
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={darkActive}
                        aria-label="Dark mode"
                        className={`switch ${darkActive ? "on" : ""}`}
                        disabled={!canDark}
                        onClick={toggleDarkMode}
                      >
                        <span className="switchKnob" />
                      </button>
                    </div>
                    <div className="menuDivider" />
                    <button type="button" className="menuItem" role="menuitem" onClick={() => setMenuOpen(false)}>
                      Sign in
                    </button>
                    {plan === "free" ? (
                      <button type="button" className="menuItem accent" role="menuitem" onClick={() => setPlan("pro")}>
                        Go Pro
                      </button>
                    ) : (
                      <button type="button" className="menuItem" role="menuitem" onClick={() => setPlan("free")}>
                        Switch to Free
                      </button>
                    )}
                    <p className="menuHint">
                      {plan === "free"
                        ? "Dark mode is a Pro feature."
                        : "Pro unlocked. Billing is a local preview for now."}
                    </p>
                  </div>
                </>
              )}
            </div>
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
            <MarkdownView source={active.body} theme={darkActive ? "dark" : "light"} />
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
