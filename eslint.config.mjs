import { FlatCompat } from "@eslint/eslintrc";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    rules: {
      "react-hooks/set-state-in-effect": "off", // Disable missing rule definition in v5
    },
  },
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts", "extension/**", "public/sw.js", "src/extension/**"],
  },
];

export default eslintConfig;
