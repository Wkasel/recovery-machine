export default {
  // Type check and lint TypeScript/JavaScript files
  "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --fix --config config/eslint.config.js"],

  // Format other files with Prettier
  "*.{json,css,scss,md}": ["prettier --write"],
};
