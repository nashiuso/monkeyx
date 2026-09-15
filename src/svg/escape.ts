// xml 1.0 illegal control characters, stripped from any user-provided text
const ILLEGAL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g;

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&apos;",
};

// escape a value for use in xml text content or double-quoted attributes
export function escapeXml(value: string): string {
  return value
    .replace(ILLEGAL, "")
    .replace(/[&<>"']/g, (ch) => ESCAPES[ch] ?? ch);
}
