import { decodeDoc, encodeDoc } from "./share";

describe("share links", () => {
  it("round-trips Markdown through the compact URL payload", async () => {
    const markdown = `# Hello

Plain Markdown, unicode like café, and raw HTML like <script>alert(1)</script>.`;

    await expect(decodeDoc(await encodeDoc(markdown))).resolves.toBe(markdown);
  });
});
