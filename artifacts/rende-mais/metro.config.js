const fs = require('fs');
const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const workspaceRoot = path.resolve(__dirname, '../..');
const appNodeModules = path.resolve(__dirname, 'node_modules');
const workspaceNodeModules = path.resolve(workspaceRoot, 'node_modules');
const localWhatwgFetch = path.resolve(appNodeModules, 'whatwg-fetch');
const rootWhatwgFetch = path.resolve(workspaceNodeModules, 'whatwg-fetch');

// Resolve modules reliably in this workspace layout for release bundling.
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  appNodeModules,
  workspaceNodeModules,
];

// Some Expo runtime imports (e.g. whatwg-fetch) may only be hoisted at workspace root in pnpm monorepos.
if (fs.existsSync(localWhatwgFetch) || fs.existsSync(rootWhatwgFetch)) {
  config.resolver.extraNodeModules = {
    ...(config.resolver.extraNodeModules || {}),
    'whatwg-fetch': fs.existsSync(localWhatwgFetch) ? localWhatwgFetch : rootWhatwgFetch,
  };
}

module.exports = config;
