import { fireEvent, render, screen } from "@testing-library/react";
import Landing from "./page";
import Write from "./write/page";

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
});
