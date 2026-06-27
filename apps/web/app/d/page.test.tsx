import { render, screen } from "@testing-library/react";
import { encodeDoc } from "../share";
import SharedDocument from "./page";

describe("SharedDocument", () => {
  beforeEach(() => {
    window.history.replaceState(null, "", "/d");
  });

  it("renders a document from the URL fragment", async () => {
    const encoded = await encodeDoc("# Shared note\n\nRead-only Markdown.");
    window.history.replaceState(null, "", `/d#${encoded}`);

    render(<SharedDocument />);

    expect(await screen.findByRole("heading", { name: "Shared note" })).toBeInTheDocument();
    expect(screen.getByText("Shared document")).toBeInTheDocument();
  });

  it("shows an empty state when the fragment is missing", async () => {
    render(<SharedDocument />);

    expect(await screen.findByText("This link does not contain a document.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Open the editor" })).toHaveAttribute("href", "/");
  });
});
