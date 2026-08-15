import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // This app has no backend: every page loads its data from localStorage
    // on mount ("useEffect(() => setState(readFromStorage()), [...])").
    // That's exactly the "synchronize with an external system" case the
    // rule's own docs describe as fine, but the rule can't tell that apart
    // from a real render-loop, so it flags every occurrence. Turned off
    // deliberately here instead of sprinkling disable-comments everywhere.
    rules: {
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
