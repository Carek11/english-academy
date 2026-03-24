import { build } from "esbuild";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

await build({
  entryPoints: [resolve(root, "api/index.ts")],
  bundle: true,
  platform: "node",
  target: "node20",
  outfile: resolve(root, "api/index.js"),
  format: "cjs",
  external: [
    "connect-pg-simple",
    "pg",
    "pg-native",
    "@mapbox/node-pre-gyp",
    "cpu-features",
    "ssh2",
  ],
  tsconfig: resolve(root, "tsconfig.json"),
  alias: {
    "@shared": resolve(root, "shared"),
    "@": resolve(root, "client/src"),
  },
});

console.log("API function compiled to api/index.js");
