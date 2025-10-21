# Bootstrapping

This is the Bootstrapping process for a professional Node Typescript project.

## 1. Project initialization

### Npm

```bash
# Initialize npm project
npm init -y
```

### Typescript

```bash
# Install Typescript
npm install typescript --save-dev
# config tsconfig.json
npx tsc --init
```

## 2. Code quality tools

### Prettier

```bash
npm install prettier --save-dev
# Config at prettier.config.js
# Ignore at .prettierignore
# Add to package.json scripts: "format": "prettier --write .",
```

### ESLint

```bash
npm init @eslint/config@latest
# Config at eslint.config.js
# Config eslint with prettier
npm install eslint-config-prettier --save-dev
# Add to package.json scripts: "lint": "eslint --fix .",
```

## 3. Git workflow tools

### Husky

```bash
npm install husky --save-dev
# Initialize husky
npx husky init
# Change Pre-commit hook to just format and lint
echo 'npm run format && npm run lint' > .husky/pre-commit
```

### Lint-staged

```bash
npm install lint-staged --save-dev
# Config at lint-staged.config.js
# Add to package.json scripts: "lint-staged": "lint-staged",
# Change Pre-commit hook to run lint-staged
```

### Commitlint

```bash
# Install commitlint
npm install commitlint --save-dev
# Install the conventional config
npm install @commitlint/config-conventional --save-dev
# Config at commitlint.config.js
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
# Add commit-msg hook
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
# test if commit-msg hook is working
git add .
git commit -m "foo: this will fail"
git commit -m "chore: setup commitlint"
```


### Commit and tag version

```bash
npm i --save-dev commit-and-tag-version
# Add to package.json scripts: "release": "commit-and-tag-version",
```

## 4. Testing tools

### Jest

```bash
npm install jest --save-dev
```

### Stryker

```bash
npm install @stryker-mutator/core --save-dev
```

---
