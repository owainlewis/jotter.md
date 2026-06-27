import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Landing from "./page";
import { decodeDoc } from "./share";
import Write from "./write/page";

beforeEach(() => {
  localStorage.clear();
  delete document.documentElement.dataset.theme;
  window.history.replaceState(null, "", "/");
});

describe("Landing", () => {
  it("renders the hero and a call to action", () => {
    render(<Landing />);

    expect(screen.getByText("Minimalist writing for agents and humans")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Start writing" }).length).toBeGreaterThan(0);
  });
});

describe("Write (editor)", () => {
  it("renders the writing shell in preview with a local save state", () => {
    render(<Write />);

    expect(screen.getByRole("region", { name: "Markdown editor" })).toBeInTheDocument();
    expect(screen.getByText("Saved locally")).toBeInTheDocument();
  });

  it("seeds a starter document titled from its first heading", () => {
    render(<Write />);

    expect(screen.getAllByText("Markdown for agents and humans").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("Documents")).toBeInTheDocument();
  });

  it("switches to edit mode to reveal the Markdown textarea", () => {
    render(<Write />);

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByRole("textbox", { name: "Markdown editor" })).toBeInTheDocument();
  });

  it("starts with the sidebar collapsed on mobile viewports", async () => {
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue({ matches: true })
    });

    render(<Write />);

    await waitFor(() => expect(screen.getByRole("button", { name: "Show sidebar" })).toBeInTheDocument());
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: originalMatchMedia
    });
  });

  it("creates a document, updates its title, and renders Markdown preview", () => {
    render(<Write />);

    fireEvent.click(screen.getByRole("button", { name: "New document" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Markdown editor" }), {
      target: { value: "# Launch note\n\nThis is **ready**." }
    });

    expect(screen.getByRole("heading", { name: "Launch note", level: 1 })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Preview" }));
    expect(screen.getByText((_, element) => element?.tagName === "P" && element.textContent === "This is ready.")).toBeInTheDocument();
    expect(screen.getByText("ready")).toBeInTheDocument();
  });

  it("filters the document list by title and body text", () => {
    render(<Write />);

    fireEvent.click(screen.getByRole("button", { name: "New document" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Markdown editor" }), {
      target: { value: "# Launch note\n\nRoadmap coverage." }
    });
    fireEvent.change(screen.getByRole("textbox", { name: "Filter documents" }), {
      target: { value: "roadmap" }
    });

    expect(screen.getByRole("button", { name: /Launch note/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Markdown for agents and humans/ })).not.toBeInTheDocument();
  });

  it("keeps document row actions as native keyboard-reachable buttons", () => {
    render(<Write />);

    const pin = screen.getByRole("button", { name: "Unpin document" });
    expect(pin.tagName).toBe("BUTTON");

    fireEvent.click(screen.getByRole("button", { name: "New document" }));
    const remove = screen.getByRole("button", { name: "Delete document" });
    expect(remove.tagName).toBe("BUTTON");
  });

  it("still renders when browser storage reads are blocked", async () => {
    const getItem = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });

    render(<Write />);

    await waitFor(() => expect(screen.getByText("Saved locally")).toBeInTheDocument());
    getItem.mockRestore();
  });

  it("copies a decodable share link for the active document", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText }
    });

    render(<Write />);

    fireEvent.click(screen.getByRole("button", { name: "New document" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Markdown editor" }), {
      target: { value: "# Shared draft\n\nReadable by link." }
    });
    fireEvent.click(screen.getByRole("button", { name: "Share" }));

    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    const copiedUrl = writeText.mock.calls[0][0] as string;
    expect(copiedUrl).toMatch(/^http:\/\/localhost(?::\d+)?\/d#/);
    await expect(decodeDoc(copiedUrl.split("#")[1])).resolves.toBe("# Shared draft\n\nReadable by link.");
    expect(await screen.findByRole("button", { name: "Copied" })).toBeInTheDocument();
  });

  it("refuses to share a document too large to fit in a link", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText }
    });

    render(<Write />);

    // Random text barely compresses, so a large body overflows the link guard.
    const huge = Array.from({ length: 30000 }, () => Math.random().toString(36)[2] ?? "x").join("");
    fireEvent.click(screen.getByRole("button", { name: "New document" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Markdown editor" }), {
      target: { value: huge }
    });
    fireEvent.click(screen.getByRole("button", { name: "Share" }));

    expect(await screen.findByRole("button", { name: "Too long" })).toBeInTheDocument();
    expect(writeText).not.toHaveBeenCalled();
  });

  it("keeps dark mode disabled until the local Pro preview is enabled", async () => {
    render(<Write />);

    fireEvent.click(screen.getByRole("button", { name: "Account" }));
    const darkMode = screen.getByRole("switch", { name: "Dark mode" });
    expect(darkMode).toBeDisabled();

    fireEvent.click(screen.getByRole("menuitem", { name: "Go Pro" }));
    expect(darkMode).not.toBeDisabled();

    fireEvent.click(darkMode);
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe("dark"));
  });
});
