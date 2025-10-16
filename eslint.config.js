import eslintPluginAstro from 'eslint-plugin-astro';
import perfectionist from 'eslint-plugin-perfectionist';

export default [
  ...eslintPluginAstro.configs.recommended.map((config) => ({
    ...config,
    files: ['src/**/*.{astro,js,jsx,ts,tsx}'],
  })),
  {
    files: ['src/**/*.{astro,js,jsx,ts,tsx}'],
    ...perfectionist.configs['recommended-natural'],
    rules: {
      'perfectionist/sort-imports': ['error'],
    },
  },
];
