import { escapeXml } from "./escape.js";

// attribute values: numbers, strings or false/undefined to omit the attribute
export type Attrs = Record<string, string | number | boolean | undefined>;

function formatValue(value: string | number | boolean): string {
  if (typeof value === "number") {
    // fixed 2-dp rounding keeps output small and platform-stable
    return String(Math.round(value * 100) / 100);
  }
  if (typeof value === "boolean") {
    return value ? "true" : "false";
  }
  return escapeXml(value);
}

// build an svg element string with deterministic attribute order
export function el(
  tag: string,
  attrs?: Attrs,
  ...children: readonly (string | false | null | undefined)[]
): string {
  let open = `<${tag}`;
  if (attrs) {
    for (const [name, value] of Object.entries(attrs)) {
      if (value === undefined || value === false) continue;
      open += ` ${name}="${formatValue(value)}"`;
    }
  }
  const inner = children
    .filter((c): c is string => typeof c === "string")
    .join("");
  return inner.length > 0 ? `${open}>${inner}</${tag}>` : `${open}/>`;
}

// css text for the <style> block; must never contain < or & (we control it)
export function styleElement(css: string): string {
  return `<style>${css}</style>`;
}
