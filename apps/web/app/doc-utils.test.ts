import { snippetOf, titleOf, wordCount } from "./doc-utils";

describe("titleOf", () => {
  it("derives the title from the first non-empty line and strips heading marks", () => {
    expect(titleOf("# Launch note\n\nBody")).toBe("Launch note");
  });

  it("keeps hyphens inside words", () => {
    expect(titleOf("# well-known release notes")).toBe("well-known release notes");
  });

  it("falls back to Untitled for empty input", () => {
    expect(titleOf("   \n\n")).toBe("Untitled");
  });
});

describe("snippetOf", () => {
  it("returns the first line of body after the title", () => {
    expect(snippetOf("# Title\n\nFirst real line.")).toBe("First real line.");
  });
});

describe("wordCount", () => {
  it("counts whitespace-separated tokens", () => {
    expect(wordCount("one two three")).toBe(3);
    expect(wordCount("   ")).toBe(0);
  });
});
