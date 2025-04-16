module.exports = {
  // Run ESLint on all staged JS/TS files
  "**/*.{js,jsx,ts,tsx}": ["eslint --fix"],

  // Run Prettier on all staged files that Prettier supports
  "**/*.{js,jsx,ts,tsx,json,css,scss,md}": ["prettier --write"],
};
