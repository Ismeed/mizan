const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(__dirname, '../..');

const config = getDefaultConfig(projectRoot);

// Watch specific monorepo paths needed (packages/shared)
config.watchFolders = [
  projectRoot,
  path.resolve(monorepoRoot, 'packages/shared'),
];

// Resolve modules: prefer local node_modules, then root node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// Pin critical singleton packages to ensure Metro always resolves the correct versions.
// react & react-dom are deduped to monorepo root (both 19.1.0 after overrides).
config.resolver.extraNodeModules = {
  '@mizan/shared': path.resolve(monorepoRoot, 'packages/shared'),
  'react':         path.resolve(monorepoRoot, 'node_modules/react'),
  'react-dom':     path.resolve(monorepoRoot, 'node_modules/react-dom'),
};

module.exports = config;
