# Rose - Nockchain Wallet Extension

Chrome extension wallet for Nockchain. Manage accounts, sign transactions, and interact with Nockchain dApps.

## Quick Start

### Prerequisites

- Node.js 18+
- Chrome browser

### Setup

```bash
# Clone
git clone <repo-url>
cd <project-folder>

# Install dependencies
npm install

# Build extension
npm run build
```

### Load in Chrome

1. Open Chrome → `chrome://extensions`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `dist/` folder

The extension icon should appear in your toolbar.

## Development

### Watch mode (rebuilds on changes)

```bash
npm run dev
```

After changes, click the refresh icon in `chrome://extensions` to reload.

### Build for production

```bash
npm run build
```

## WASM Modules

WASM binaries are **pre-built and included** in `@nockchain/sdk`. No build required.

## Local development: publishing `@nockchain/rose-wasm` / `@nockchain/sdk` to a local npm registry

When you make changes to `@nockchain/rose-wasm`, **do not use** `file:` dependencies for Rose. Instead, publish to a **local npm registry** and consume via normal semver versions (so the repo can be checked in using npm-style deps).

### One-time setup (Verdaccio)

Start a local registry:

```bash
npm i -g verdaccio
verdaccio --listen 4873
```

Point only the `@nockbox` scope at Verdaccio:

```bash
npm config set @nockbox:registry http://localhost:4873
```

Create a local registry user and login:

```bash
npm adduser --registry http://localhost:4873
npm login --registry http://localhost:4873
```

### Publish workflow

1. **Publish `@nockchain/rose-wasm`** from your local `rose-wasm` repo checkout:

```bash
# in the rose-wasm package directory
npm version 0.1.3 --no-git-tag-version
npm publish --registry http://localhost:4873
```

2. **Bump + publish `@nockchain/sdk`** (this repo’s `sdk/`):

```bash
cd sdk
# update sdk/package.json:
# - "version": "0.1.2"
# - "@nockchain/rose-wasm": "0.1.3"
npm run build
npm publish --registry http://localhost:4873
```

3. **Consume in Rose** using normal npm deps (no `file:`):

```bash
cd ..
# update package.json:
# - "@nockchain/sdk": "0.1.2"
npm install
```

### Verify what you’re using

```bash
npm view @nockchain/rose-wasm version --registry http://localhost:4873
npm view @nockchain/sdk version --registry http://localhost:4873
npm ls @nockchain/sdk @nockchain/rose-wasm
```
