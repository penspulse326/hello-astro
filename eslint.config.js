import eslintPluginAstro from 'eslint-plugin-astro';
import perfectionist from 'eslint-plugin-perfectionist';

export default [...eslintPluginAstro.configs.recommended, perfectionist.configs['recommended-natural']];
