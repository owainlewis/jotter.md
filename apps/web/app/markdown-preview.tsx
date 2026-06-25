"use client";

import { Children, isValidElement, useEffect, useId, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

type MarkdownPreviewProps = {
  source: string;
};

type MermaidState =
  | { status: "rendering" }
  | { status: "ready"; svg: string }
  | { status: "error"; message: string };

function MermaidBlock({ chart }: { chart: string }) {
  const reactId = useId();
  const mermaidId = `mermaid-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const [state, setState] = useState<MermaidState>({ status: "rendering" });

  useEffect(() => {
    let isCurrent = true;

    async function renderDiagram() {
      setState({ status: "rendering" });

      try {
        const mermaidModule = await import("mermaid");
        const mermaid = mermaidModule.default;
        mermaid.setParseErrorHandler(() => undefined);
        mermaid.initialize({
          securityLevel: "strict",
          startOnLoad: false,
          theme: "base",
          themeVariables: {
            fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
            primaryColor: "#fffefa",
            primaryTextColor: "#20201d",
            lineColor: "#686861"
          }
        });

        const parseResult = await mermaid.parse(chart, { suppressErrors: true });

        if (!parseResult) {
          throw new Error("Invalid Mermaid diagram.");
        }

        const result = await mermaid.render(mermaidId, chart);

        if (isCurrent) {
          setState({ status: "ready", svg: result.svg });
        }
      } catch (error) {
        if (isCurrent) {
          setState({
            status: "error",
            message: error instanceof Error ? error.message : "Unable to render Mermaid diagram."
          });
        }
      }
    }

    renderDiagram();

    return () => {
      isCurrent = false;
    };
  }, [chart, mermaidId]);

  if (state.status === "error") {
    return (
      <div className="mermaidError" role="note">
        <strong>Mermaid preview error</strong>
        <pre>{state.message}</pre>
      </div>
    );
  }

  if (state.status === "rendering") {
    return <div className="mermaidFrame">Rendering diagram...</div>;
  }

  return <div className="mermaidFrame" dangerouslySetInnerHTML={{ __html: state.svg }} />;
}

export default function MarkdownPreview({ source }: MarkdownPreviewProps) {
  if (!source.trim()) {
    return <p className="placeholder">Nothing to preview yet.</p>;
  }

  return (
    <ReactMarkdown
      rehypePlugins={[rehypeSanitize]}
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ href, children }) => (
          <a href={href} rel="noreferrer" target={href?.startsWith("#") ? undefined : "_blank"}>
            {children}
          </a>
        ),
        code: ({ className, children, ...props }) => {
          const language = /language-(\w+)/.exec(className ?? "")?.[1];
          const value = String(children).replace(/\n$/, "");

          if (language === "mermaid") {
            return <MermaidBlock chart={value} />;
          }

          return (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
        pre: ({ children }) => {
          const child = Children.only(children);

          if (isValidElement(child) && child.type === MermaidBlock) {
            return <>{child}</>;
          }

          return <pre>{children}</pre>;
        }
      }}
    >
      {source}
    </ReactMarkdown>
  );
}
