import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MARKDOWN_EXPORT_FILENAME } from "./document-actions";
import { LOCAL_DRAFT_KEY } from "./draft-storage";
import Home from "./page";

function readBlob(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("load", () => resolve(String(reader.result)));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsText(blob);
  });
}

vi.mock("@uiw/react-codemirror", () => ({
  default: ({
    "aria-label": ariaLabel,
    onChange,
    placeholder,
    value
  }: {
    "aria-label": string;
    onChange: (value: string) => void;
    placeholder: string;
    value: string;
  }) => (
    <textarea
      aria-label={ariaLabel}
      onChange={(event) => onChange(event.currentTarget.value)}
      placeholder={placeholder}
      value={value}
    />
  )
}));

vi.mock("@codemirror/lang-markdown", () => ({
  markdown: () => []
}));

vi.mock("mermaid", () => ({
  default: {
    initialize: vi.fn(),
    parse: vi.fn(async (source: string) => !source.includes("broken")),
    render: vi.fn(async (_id: string, source: string) => {
      if (source.includes("broken")) {
        throw new Error("Parse error on line 1");
      }

      return {
        svg: `<svg role="img" aria-label="Mermaid diagram"><text>${source}</text></svg>`
      };
    }),
    setParseErrorHandler: vi.fn()
  }
}));

describe("Home", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  it("renders the anonymous Markdown editor", () => {
    render(<Home />);

    expect(screen.getByText("A Markdown notepad for agents and humans.")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Markdown editor" })).toBeInTheDocument();
    expect(screen.getByText("Unsaved local draft")).toBeInTheDocument();
  });

  it("lets users type and edit Markdown without an account", async () => {
    const user = userEvent.setup();

    render(<Home />);

    const editor = screen.getByRole("textbox", { name: "Markdown editor" });
    await user.type(editor, "# Hello");

    expect(editor).toHaveValue("# Hello");
    expect(screen.getByText("2 words")).toBeInTheDocument();
  });

  it("hydrates and clears the local anonymous draft", async () => {
    const user = userEvent.setup();
    window.localStorage.setItem(
      LOCAL_DRAFT_KEY,
      JSON.stringify({
        body: "Persisted **draft**",
        lastEditedAt: "2026-06-25T12:00:00.000Z"
      })
    );

    render(<Home />);

    expect(await screen.findByDisplayValue("Persisted **draft**")).toBeInTheDocument();
    vi.spyOn(window, "confirm").mockReturnValue(true);
    await user.click(screen.getByRole("button", { name: "Clear" }));

    expect(screen.getByRole("textbox", { name: "Markdown editor" })).toHaveValue("");
    expect(window.localStorage.getItem(LOCAL_DRAFT_KEY)).toBeNull();
  });

  it("toggles edit and view modes without losing content", async () => {
    const user = userEvent.setup();

    render(<Home />);

    const editor = screen.getByRole("textbox", { name: "Markdown editor" });
    await user.type(editor, "Keep this draft");
    await user.click(screen.getByRole("button", { name: "View" }));

    expect(screen.getByLabelText("Markdown preview")).toHaveTextContent("Keep this draft");
    expect(screen.getByText("View mode")).toBeInTheDocument();

    fireEvent.keyDown(screen.getByLabelText("Writing area"), { ctrlKey: true, key: "r" });

    expect(screen.getByRole("textbox", { name: "Markdown editor" })).toHaveValue("Keep this draft");
    expect(screen.getByText("Edit mode")).toBeInTheDocument();
  });

  it("does not hijack refresh shortcuts from document action controls", () => {
    render(<Home />);

    const copyButton = screen.getByRole("button", { name: "Copy" });
    const event = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      ctrlKey: true,
      key: "r"
    });

    copyButton.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(false);
    expect(screen.getByText("Edit mode")).toBeInTheDocument();
  });

  it("renders common Markdown in view mode", async () => {
    const user = userEvent.setup();
    const markdown = [
      "# Heading",
      "",
      "A paragraph with [a link](https://example.com) and `inline code`.",
      "",
      "- One",
      "- Two",
      "",
      "> A quote",
      "",
      "| Name | Value |",
      "| --- | --- |",
      "| Alpha | Beta |",
      "",
      "```ts",
      "const ok = true;",
      "```"
    ].join("\n");

    render(<Home />);

    fireEvent.change(screen.getByRole("textbox", { name: "Markdown editor" }), {
      target: { value: markdown }
    });
    await user.click(screen.getByRole("button", { name: "View" }));

    expect(screen.getByRole("heading", { level: 1, name: "Heading" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "a link" })).toHaveAttribute("href", "https://example.com");
    expect(screen.getByText("inline code")).toBeInTheDocument();
    expect(screen.getByRole("list")).toBeInTheDocument();
    expect(screen.getByText("A quote")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("const ok = true;")).toBeInTheDocument();
  });

  it("renders valid Mermaid and contains invalid Mermaid errors", async () => {
    const user = userEvent.setup();
    const markdown = [
      "Before diagram.",
      "",
      "```mermaid",
      "flowchart TD",
      "  A[Start] --> B[Done]",
      "```",
      "",
      "After valid diagram.",
      "",
      "```mermaid",
      "broken",
      "```",
      "",
      "After invalid diagram."
    ].join("\n");

    render(<Home />);

    fireEvent.change(screen.getByRole("textbox", { name: "Markdown editor" }), {
      target: { value: markdown }
    });
    await user.click(screen.getByRole("button", { name: "View" }));

    expect(await screen.findByLabelText("Mermaid diagram")).toBeInTheDocument();
    expect(await screen.findByText("Mermaid preview error")).toBeInTheDocument();
    expect(screen.getByText("After invalid diagram.")).toBeInTheDocument();
  });

  it("copies and exports the exact Markdown source", async () => {
    const user = userEvent.setup();
    const markdown = "# Export me\n\nExact `source`.";
    const clipboard = {
      writeText: vi.fn().mockResolvedValue(undefined)
    };
    let exportedBlob: Blob | null = null;
    let exportedFilename = "";
    const linkClick = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function clickDownloadLink() {
      exportedFilename = this.download;
    });

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: clipboard
    });
    vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
      exportedBlob = blob as Blob;
      return "blob:jotter";
    });
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);

    render(<Home />);

    fireEvent.change(screen.getByRole("textbox", { name: "Markdown editor" }), {
      target: { value: markdown }
    });

    await user.click(screen.getByRole("button", { name: "Copy" }));
    await user.click(screen.getByRole("button", { name: "Export .md" }));

    expect(clipboard.writeText).toHaveBeenCalledWith(markdown);
    expect(linkClick).toHaveBeenCalled();
    expect(exportedFilename).toBe(MARKDOWN_EXPORT_FILENAME);
    expect(exportedBlob).toBeInstanceOf(Blob);
    expect(await readBlob(exportedBlob as Blob)).toBe(markdown);
  });
});
