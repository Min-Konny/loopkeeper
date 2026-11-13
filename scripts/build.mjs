import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("..", import.meta.url));
const output = path.join(root, "dist");
// Rebuild cleanly; resolve the deletion target inside this workspace first.
if (
  path.dirname(path.resolve(output)) !== path.resolve(root) ||
  path.basename(output) !== "dist"
)
  throw new Error("Unexpected distribution path");
await fs.rm(output, { recursive: true, force: true });
await fs.mkdir(output, { recursive: true });
for (const entry of ["index.html", "src", "assets"])
  await fs.cp(path.join(root, entry), path.join(output, entry), {
    recursive: true,
    filter: source => path.basename(source) !== "celtic-camp.wav",
  });
await fs.writeFile(path.join(output, ".nojekyll"), "");
// A release must not mix a new entry point with cached engine/UI dependencies.
const { version } = JSON.parse(await fs.readFile(path.join(root, "package.json"), "utf8"));
const entry=path.join(output,"index.html");
await fs.writeFile(entry,(await fs.readFile(entry,"utf8")).replace(/\?v=\d+\.\d+\.\d+/g,`?v=${version}`));
for (const name of await fs.readdir(path.join(output, "src"))) {
  if (!name.endsWith(".js")) continue;
  const target = path.join(output, "src", name);
  const source = await fs.readFile(target, "utf8");
  await fs.writeFile(target, source.replace(
    /(\bfrom\s*|\bimport\s*)(["'])(\.\/[^"'?]+\.js)\2/g,
    (_, prefix, quote, specifier) => `${prefix}${quote}${specifier}?v=${version}${quote}`,
  ));
}
console.log("dist: static game files prepared; no deployment performed.");
