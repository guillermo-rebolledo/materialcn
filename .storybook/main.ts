import type { StorybookConfig } from "@storybook/react-vite"

const config: StorybookConfig = {
  // Stories live next to the components they document.
  stories: [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    "@storybook/addon-mcp",
  ],
  framework: "@storybook/react-vite",
  // Vite config (Tailwind plugin + the `@` alias) is inherited from
  // vite.config.ts, so there is nothing to duplicate here.
}

export default config
