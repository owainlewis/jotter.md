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
    (async () => {
      try {
        const fragment = decodeURIComponent(window.location.hash.slice(1));
        if (!fragment) {
          setMissing(true);
          return;
        }
        setBody(await decodeDoc(fragment));
      } catch {
        setMissing(true);
      }
    })();
  }, []);

  return (
    <div className="shareView">
      <header className="shareBar">
        <Link className="brand" href="/" aria-label="passage.md">
          <span className="brandMark" aria-hidden="true">
            P
          </span>
          <span className="brandName">
            passage<span className="brandExt">.md</span>
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
