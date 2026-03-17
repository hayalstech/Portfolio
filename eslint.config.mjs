import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  
  // Production presets and rules
  {
    rules: {
      // Performance optimizations
      "prefer-const": "error",
      "no-unused-vars": "error",
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off",
      
      // Code quality presets
      "react-hooks/exhaustive-deps": "warn",
      "react-hooks/rules-of-hooks": "error",
      "@next/next/no-img-element": "error",
      "@next/next/no-page-custom-font": "warn",
      
      // Accessibility presets
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-has-content": "error",
      
      // Best practices
      "react/prop-types": "off", // Using TypeScript
      "react/react-in-jsx-scope": "off", // Next.js handles this
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Additional ignores for production:
    "dist/**",
    "coverage/**",
    "*.min.js",
    "node_modules/**",
  ]),
]);

export default eslintConfig;
