import {
  createHighlighterCore,
  bundledLanguages,
  bundledThemes,
  createJavaScriptRegexEngine,
} from "shiki";

let highlighter: Awaited<ReturnType<typeof createHighlighterCore>> | null = null;

export async function initHighlighter() {
  try {
    highlighter = await createHighlighterCore({
      themes: [
        {
          name: "github-light",
          ...bundledThemes["github-light"],
        },
      ],
      langs: [
        bundledLanguages.typescript,
        bundledLanguages.javascript,
        bundledLanguages.tsx,
        bundledLanguages.jsx,
        bundledLanguages.markdown,
        bundledLanguages.json,
        // plaintext is handled in the highlightCode function
      ],
      engine: createJavaScriptRegexEngine(), // Add the JavaScript regex engine
    });

    await highlighter.loadTheme({
      name: "github-light",
      ...bundledThemes["github-light"],
    });
  } catch (e) {
    console.error("Failed to initialize highlighter:", e);
  }
}

function escapeHtml(code: string | null | undefined) {
  if (code == null) return "";
  return String(code)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function highlightCode(
  code: string | null | undefined,
  lang: string = "text",
  theme: string = "github-light"
) {
  const safeCode = code == null ? "" : String(code);
  if (!highlighter) {
    return `<pre><code>${escapeHtml(safeCode)}</code></pre>`;
  }
  try {
    // Check if the language is supported, fallback to 'text' if not
    const supportedLang = lang in bundledLanguages ? lang : "text";
    return highlighter.codeToHtml(safeCode, { lang: supportedLang, theme });
  } catch (e) {
    console.error("Highlighting failed:", e);
    return `<pre><code>${escapeHtml(safeCode)}</code></pre>`;
  }
}
