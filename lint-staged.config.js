const lintStaged = {
  'src/**/*.{ts,tsx}': ['prettier --write', 'eslint --fix', 'git add'],
};
export default lintStaged;
