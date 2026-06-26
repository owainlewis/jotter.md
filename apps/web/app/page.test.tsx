import { fireEvent, render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home", () => {
  it("renders the writing shell in preview with a local save state", () => {
    render(<Home />);

    expect(screen.getByRole("region", { name: "Markdown editor" })).toBeInTheDocument();
    expect(screen.getByText("Saved locally")).toBeInTheDocument();
  });

  it("seeds a starter document titled from its first heading", () => {
    render(<Home />);

    // Title is derived from the first heading and appears in the top bar
    // and the sidebar document row.
    expect(screen.getAllByText("Markdown for agents and humans").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("Documents")).toBeInTheDocument();
  });

  it("switches to edit mode to reveal the Markdown textarea", () => {
    render(<Home />);

    fireEvent.click(screen.getByRole("button", { name: "Edit" }));
    expect(screen.getByRole("textbox", { name: "Markdown editor" })).toBeInTheDocument();
  });
});
