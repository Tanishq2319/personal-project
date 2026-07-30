import type { NextConfig } from "next";

// TypeScript 7 (native) needs the CLI path rather than the old compiler API.
const config: NextConfig = { experimental: { useTypeScriptCli: true } };

export default config;
