"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MarkdownView } from "../markdown-view";
import { decodeDoc } from "../share";

export default function SharedDocument() {
  const [body, setBody] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    // The document lives in the URL fragment, which is only readable on the
    // client, so this state is populated after mount by design.
    /* eslint-disable react-hooks/set-state-in-effect */
    try {
      const fragment = decodeURIComponent(window.location.hash.slice(1));
      if (!fragment) {
        setMissing(true);
        return;
      }
      setBody(decodeDoc(fragment));
    } catch {
      setMissing(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  return (
    <div className="shareView">
      <header className="shareBar">
        <Link className="brand" href="/" aria-label="jotter.md">
          <span className="brandMark" aria-hidden="true">
            J
          </span>
          <span className="brandName">
            jotter<span className="brandExt">.md</span>
          </span>
        </Link>
        <span className="shareMeta">{body ? "Shared document" : "Read-only"}</span>
      </header>

      <main className="shareScroll">
        {body !== null ? (
          <MarkdownView source={body} />
        ) : missing ? (
          <div className="shareEmpty">
            <p>This link does not contain a document.</p>
            <Link className="shareEmptyLink" href="/">
              Open the editor
            </Link>
          </div>
        ) : null}
      </main>
    </div>
  );
}
