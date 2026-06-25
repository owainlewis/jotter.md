import { expect, test } from "@playwright/test";

const draft = [
  "# Demo doc",
  "",
  "A paragraph with [a link](https://example.com) and `inline code`.",
  "",
  "- One",
  "- Two",
  "",
  "> A useful quote",
  "",
  "| Name | Value |",
  "| --- | --- |",
  "| Alpha | Beta |",
  "",
  "```ts",
  "const ok = true;",
  "```",
  "",
  "```mermaid",
  "flowchart TD",
  "  A[Start] --> B[Done]",
  "```",
  "",
  "```mermaid",
  "broken",
  "```",
  "",
  "After invalid diagram."
].join("\n");

async function fillEditor(page: import("@playwright/test").Page, source: string) {
  const editor = page.getByLabel("Markdown editor");

  await editor.click();
  await page.keyboard.insertText(source);
}

test("anonymous local Markdown flow", async ({ context, page }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");

  await expect(page.getByText("A Markdown notepad for agents and humans.")).toBeVisible();
  await fillEditor(page, draft);

  await page.reload();
  await expect(page.getByLabel("Markdown editor")).toContainText("Demo doc");

  await page.getByLabel("Markdown editor").click();
  await page.keyboard.press(process.platform === "darwin" ? "Meta+R" : "Control+R");
  await expect(page.getByRole("heading", { level: 1, name: "Demo doc" })).toBeVisible();
  await expect(page.getByRole("table")).toBeVisible();
  await expect(page.locator(".mermaidFrame svg").first()).toBeVisible();
  await expect(page.getByText("Mermaid preview error")).toBeVisible();
  await expect(page.getByText("After invalid diagram.")).toBeVisible();

  await page.getByRole("button", { name: "Copy" }).click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(draft);

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export .md" }).click();
  const download = await downloadPromise;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];

  if (!stream) {
    throw new Error("Expected exported Markdown download stream.");
  }

  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  expect(download.suggestedFilename()).toBe("jotter-draft.md");
  expect(Buffer.concat(chunks).toString("utf8")).toBe(draft);

  page.on("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Clear" }).click();
  await expect(page.getByText("Draft cleared")).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Markdown editor")).not.toContainText("Demo doc");
});
