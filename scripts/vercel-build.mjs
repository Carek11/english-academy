import { build } from "esbuild";
import { execSync } from "child_process";
import { cpSync, mkdirSync, writeFileSync, rmSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");
const outputDir = resolve(root, ".vercel/output");

console.log("=== Vercel Build Output API ===");

// Clean
rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

// ---------- 1. Client (Vite) ----------
console.log("\n[1/4] Building client with Vite...");
execSync("npx vite build", { stdio: "inherit", cwd: root });

// Copy static files
console.log("[2/4] Copying static files...");
const staticDir = resolve(outputDir, "static");
mkdirSync(staticDir, { recursive: true });
cpSync(resolve(root, "dist/public"), staticDir, { recursive: true });

// ---------- 2. API Function ----------
console.log("[3/4] Building API function with esbuild...");

const funcDir = resolve(outputDir, "functions/api/index.func");
mkdirSync(funcDir, { recursive: true });

// Only mark packages that:
// - use __dirname to read files at runtime (connect-pg-simple reads table.sql in constructor)
// - are native C++ addons (pg-native, bcrypt, etc.)
// pg and its deps are pure JS → bundle them directly
const externalPkgs = [
  "connect-pg-simple",  // reads table.sql via __dirname (lazy, but safer as external)
  "pg-native",          // native C++ addon
  "bcrypt",             // native C++ addon (if used)
  "cpu-features",
  "ssh2",
  "@mapbox/node-pre-gyp",
];

await build({
  entryPoints: [resolve(root, "server/vercel-entry.ts")],
  bundle: true,
  platform: "node",
  target: "node20",
  outfile: resolve(funcDir, "index.js"),
  format: "cjs",
  external: externalPkgs,
  tsconfig: resolve(root, "tsconfig.json"),
  alias: {
    "@shared": resolve(root, "shared"),
    "@": resolve(root, "client/src"),
  },
  // Eliminate dev-only branches (Vite dev server setup, etc.)
  define: {
    "process.env.NODE_ENV": '"production"',
  },
  minify: false,
  sourcemap: false,
  // Vercel Build Output API expects module.exports to BE the handler function (not an ESM-in-CJS wrapper)
  footer: {
    js: 'if (typeof module !== "undefined" && module.exports && typeof module.exports.default === "function") { module.exports = module.exports.default; }',
  },
});

console.log("  ✓ esbuild complete");

// ---------- 3. Copy ONLY truly external packages ----------
// connect-pg-simple needs to be present in node_modules because it's external
// (We never instantiate it on Vercel – MemoryStore is used – but the require() must resolve)
console.log("[4/4] Copying external packages to Lambda...");
const funcNodeModules = resolve(funcDir, "node_modules");
mkdirSync(funcNodeModules, { recursive: true });

// connect-pg-simple only (pg-native etc. are optional/lazy and not actually loaded on Vercel)
const pkgsToCopy = ["connect-pg-simple"];

for (const pkg of pkgsToCopy) {
  const src = resolve(root, "node_modules", pkg);
  const dest = resolve(funcNodeModules, pkg);
  if (existsSync(src)) {
    cpSync(src, dest, { recursive: true });
    console.log("  ✓", pkg);
  } else {
    console.warn("  ⚠ not found:", pkg);
  }
}

// ---------- 4. Function config ----------
writeFileSync(
  resolve(funcDir, ".vc-config.json"),
  JSON.stringify({ runtime: "nodejs20.x", handler: "index.js", maxDuration: 30 }, null, 2)
);

// Force CommonJS mode (root package.json has "type":"module" which would break CJS bundle)
writeFileSync(
  resolve(funcDir, "package.json"),
  JSON.stringify({ type: "commonjs" }, null, 2)
);

// ---------- 5. Output config (routing) ----------
writeFileSync(
  resolve(outputDir, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        { src: "/api/(.*)", dest: "/api/index" },
        { handle: "filesystem" },
        { src: "/(.*)", dest: "/index.html" },
      ],
    },
    null,
    2
  )
);

console.log("\n✅ Build complete!");
console.log("  Static: .vercel/output/static/");
console.log("  Function: .vercel/output/functions/api/index.func/");
