export default {
  // Type check and lint TypeScript/JavaScript files
  "*.{js,jsx,ts,tsx}": ["prettier --write", "eslint --fix"],

  // Format other files with Prettier
  "*.{json,css,scss,md}": ["prettier --write"],
};
