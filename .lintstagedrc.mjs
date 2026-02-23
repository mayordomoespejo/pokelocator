const config = {
  "*.{ts,tsx}": ["prettier --write", "eslint --fix"],
  "*.{css,json,md}": ["prettier --write"],
};

export default config;
