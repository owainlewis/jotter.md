"use client";

import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { copyMarkdown, downloadMarkdown } from "./document-actions";
import { clearLocalDraft, readLocalDraft, writeLocalDraft } from "./draft-storage";
import MarkdownPreview from "./markdown-preview";

const homepageTag = "A Markdown notepad for agents and humans.";
type Mode = "edit" | "view";

function countWords(markdownSource: string) {
  return markdownSource.trim().split(/\s+/).filter(Boolean).length;
}

export default function LocalJotter() {
  const [body, setBody] = useState("");
  const [lastEditedAt, setLastEditedAt] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>("edit");
  const [actionMessage, setActionMessage] = useState("");
  const writingAreaRef = useRef<HTMLElement>(null);
  const wordCount = useMemo(() => countWords(body), [body]);
  const draftStatus = lastEditedAt ? `Saved locally ${new Date(lastEditedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  })}` : "Unsaved local draft";

  useEffect(() => {
    const draft = readLocalDraft();

    if (!draft) {
      return undefined;
    }

    const frameId = window.requestAnimationFrame(() => {
      setBody(draft.body);
      setLastEditedAt(draft.lastEditedAt);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, []);

  useEffect(() => {
    writingAreaRef.current?.focus();
  }, [mode]);

  useEffect(() => {
    function handleShortcut(event: KeyboardEvent) {
      const isRefreshToggle = event.key.toLowerCase() === "r" && (event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey;
      const target = event.target instanceof Node ? event.target : null;
      const isWritingSurfaceTarget = Boolean(target && writingAreaRef.current?.contains(target));

      if (!isRefreshToggle || !isWritingSurfaceTarget) {
        return;
      }

      event.preventDefault();
      setMode((currentMode) => currentMode === "edit" ? "view" : "edit");
    }

    document.addEventListener("keydown", handleShortcut);

    return () => {
      document.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  function handleBodyChange(nextBody: string) {
    setBody(nextBody);
    setActionMessage("");

    const draft = writeLocalDraft(nextBody);

    if (draft) {
      setLastEditedAt(draft.lastEditedAt);
    }
  }

  function handleClearDraft() {
    const confirmed = window.confirm("Clear the local draft?");

    if (!confirmed) {
      return;
    }

    clearLocalDraft();
    setBody("");
    setLastEditedAt(null);
    setActionMessage("Draft cleared");
  }

  async function handleCopyMarkdown() {
    await copyMarkdown(body);
    setActionMessage("Markdown copied");
  }

  function handleExportMarkdown() {
    downloadMarkdown(body);
    setActionMessage("Markdown exported");
  }

  return (
    <main className="shell">
      <header className="topBar" aria-label="Application header">
        <Link className="brand" href="/" aria-label="jotter.md home">
          jotter.md
        </Link>
        <p className="tagline">{homepageTag}</p>
        <span className="statusPill">Local</span>
      </header>

      <section className="toolbar" aria-label="Document controls">
        <span aria-hidden="true" />
        <div className="modeSwitch" aria-label="Mode">
          <button aria-pressed={mode === "edit"} onClick={() => setMode("edit")} type="button">
            Edit
          </button>
          <button aria-pressed={mode === "view"} onClick={() => setMode("view")} type="button">
            View
          </button>
        </div>
        <div className="documentActions" aria-label="Document actions">
          <button className="textButton" onClick={handleCopyMarkdown} type="button">
            Copy
          </button>
          <button className="textButton" onClick={handleExportMarkdown} type="button">
            Export .md
          </button>
          <button className="textButton" onClick={handleClearDraft} type="button">
            Clear
          </button>
        </div>
      </section>

      <section className="writingPane" aria-label="Writing area" data-writing-surface="true" ref={writingAreaRef} tabIndex={-1}>
        {mode === "edit" ? (
          <CodeMirror
            aria-label="Markdown editor"
            basicSetup={{
              foldGutter: false,
              highlightActiveLine: false,
              highlightActiveLineGutter: false,
              lineNumbers: false
            }}
            className="pageSurface editorSurface"
            extensions={[markdown()]}
            height="100%"
            onChange={handleBodyChange}
            placeholder="Start writing Markdown."
            theme="light"
            value={body}
          />
        ) : (
          <article className="pageSurface previewSurface" aria-label="Markdown preview">
            <MarkdownPreview source={body} />
          </article>
        )}
      </section>

      <footer className="bottomBar" aria-label="Editor status">
        <span>{mode === "edit" ? "Edit mode" : "View mode"}</span>
        <span>{wordCount} words</span>
        <span>{draftStatus}</span>
        <span aria-live="polite">{actionMessage}</span>
      </footer>
    </main>
  );
}
