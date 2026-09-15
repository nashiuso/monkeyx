// monkeyx command line interface — zero dependencies beyond node stdlib.
// examples:
//   monkeyx nashiuso
//   monkeyx alice --size 128 --animation blink
//   monkeyx bob --style neon --background transparent --json
//   monkeyx carol --trait hair=buns --trait eyes=wink -o carol.svg
import { parseArgs } from "node:util";
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { generateDetail } from "./generate.js";
import type { GenerateOptions } from "./options.js";
import { MonkeyxError } from "./errors.js";
import { VERSION } from "./version.js";

const HELP = `monkeyx — deterministic monkey avatar generator

usage:
  monkeyx <seed> [options]

options:
  -o, --out <file>        write the svg to a file instead of stdout
  -p, --preset <id>       generation preset (default, minimal, playful, monochrome)
  -t, --style <id>        design family (classic, soft, bold, tiny, paper, retro, night, neon)
  -a, --animation <ids>   comma-separated animation presets
                          (idle, blink, double-blink, bounce, wave, float,
                           wiggle, tail, ears, nod, shake, dance, excited, sleepy)
      --speed <n>         animation speed multiplier (0.25-4, default 1)
  -s, --size <px>         rendered width/height, 16-1024
      --palette <id>      force a fur palette
      --accent <hex>      force the clothing/accessory accent color
      --background <bg>   "auto", "transparent", "none" or a hex color
      --title <text>      accessible title
      --trait <fam=id>    override a trait family, repeatable (e.g. --trait eyes=wide)
      --json              print generation details as json instead of svg
  -h, --help              show this help
  -v, --version           show version

examples:
  monkeyx nashiuso
  monkeyx alice --size 128 --animation blink
  monkeyx bob --style neon --background transparent --json
  monkeyx carol --animation idle,blink,tail --speed 1.5
  monkeyx dana -p playful --trait hair=buns --trait eyes=wink -o dana.svg
`;

export interface CliIo {
  out(text: string): void;
  err(text: string): void;
}

// parse --trait family=id pairs onto the options object
function applyTraits(
  options: GenerateOptions,
  pairs: readonly string[],
  io: CliIo,
): boolean {
  for (const pair of pairs) {
    const eq = pair.indexOf("=");
    if (eq <= 0) {
      io.err(`error: --trait expects family=id, got "${pair}"\n`);
      return false;
    }
    Object.assign(options, { [pair.slice(0, eq)]: pair.slice(eq + 1) });
  }
  return true;
}

// pure-ish cli runner: returns the process exit code
export function runCli(argv: readonly string[], io: CliIo): number {
  try {
    const { values, positionals } = parseArgs({
      args: [...argv],
      options: {
        out: { type: "string", short: "o" },
        preset: { type: "string", short: "p" },
        style: { type: "string", short: "t" },
        animation: { type: "string", short: "a" },
        speed: { type: "string" },
        size: { type: "string", short: "s" },
        palette: { type: "string" },
        accent: { type: "string" },
        background: { type: "string" },
        title: { type: "string" },
        trait: { type: "string", multiple: true },
        json: { type: "boolean" },
        help: { type: "boolean", short: "h" },
        version: { type: "boolean", short: "v" },
      },
      allowPositionals: true,
    });

    if (values.help) {
      io.out(HELP);
      return 0;
    }
    if (values.version) {
      io.out(`monkeyx v${VERSION}\n`);
      return 0;
    }

    const seed = positionals[0];
    if (seed === undefined) {
      io.err("error: a seed is required\n\n");
      io.err(HELP);
      return 1;
    }

    const options: GenerateOptions = {};
    if (values.preset !== undefined) options.preset = values.preset as never;
    if (values.style !== undefined) options.style = values.style as never;
    if (values.palette !== undefined) options.palette = values.palette;
    if (values.accent !== undefined) options.accent = values.accent;
    if (values.background !== undefined) options.background = values.background;
    if (values.title !== undefined) options.title = values.title;
    if (values.size !== undefined) options.size = Number(values.size);
    if (values.animation !== undefined) {
      const ids = values.animation
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id.length > 0);
      options.animation = ids.length === 1 ? (ids[0] as never) : (ids as never);
    }
    if (values.speed !== undefined) {
      const animation = (options.animation ?? {}) as { preset?: unknown };
      const preset =
        typeof options.animation === "string" ||
        Array.isArray(options.animation)
          ? options.animation
          : animation.preset;
      options.animation = {
        preset: preset as never,
        speed: Number(values.speed),
      };
    }
    if (!applyTraits(options, values.trait ?? [], io)) return 1;

    const detail = generateDetail(seed, options);

    if (values.json) {
      io.out(
        `${JSON.stringify({ ...detail, animation: [...detail.animation] }, null, 2)}\n`,
      );
      return 0;
    }

    const svg = `${detail.svg}\n`;
    if (values.out !== undefined) {
      writeFileSync(values.out, svg, "utf8");
      io.err(`wrote ${detail.bytes} bytes to ${values.out}\n`);
    } else {
      io.out(svg);
    }
    return 0;
  } catch (error) {
    const message =
      error instanceof MonkeyxError || error instanceof Error
        ? error.message
        : String(error);
    io.err(`monkeyx: ${message}\n`);
    return 1;
  }
}

function main(): void {
  const io: CliIo = {
    out: (text) => process.stdout.write(text),
    err: (text) => process.stderr.write(text),
  };
  process.exitCode = runCli(process.argv.slice(2), io);
}

// only auto-run when executed directly, not when imported by tests
if (
  process.argv[1] !== undefined &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main();
}
