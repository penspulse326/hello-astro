// @ts-check
import { defineConfig } from "astro/config";
import remarkDirective from "remark-directive";

import { remarkAdmonitions } from "./src/plugins/remark-admonitions.mjs";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkDirective, remarkAdmonitions],
  },
});
