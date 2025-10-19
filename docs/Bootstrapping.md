# Bootstrapping

This is a Node Typescript project.

## 1. Project initialization

### Npm

```bash
npm init -y
```

### Typescript

```bash
npm install typescript --save-dev
# config tsconfig.json
npx tsc --init
```

## 2. Code quality tools

### Prettier

```bash
npm install prettier --save-dev
# config at prettier.config.js and at .prettierignore
# add to package.json: "format": "prettier --write .",
```

### ESLint

```bash
npm install eslint --save-dev
# plugin eslint with prettier
npm install eslint-plugin-prettier --save-dev
npm install eslint-config-prettier --save-dev
```

## 3. Git workflow tools

### Husky

```bash
npm install husky --save-dev
```

### Commitlint

```bash
npm install commitlint --save-dev
```

### Lint-staged

```bash
npm install lint-staged --save-dev
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

## Full installScript

```bash
npm init -y
npm install typescript prettier eslint husky commitlint lint-staged jest @stryker-mutator/core --save-dev
```
