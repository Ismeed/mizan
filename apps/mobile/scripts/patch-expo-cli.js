#!/usr/bin/env node
/**
 * patch-expo-cli.js  
 * Patches Expo CLI for Node v22 network compatibility.
 * React 19.1.0 is now correctly installed — no shims needed.
 */

const fs = require('fs');
const path = require('path');

// Resolve from monorepo root (3 levels up from apps/mobile/scripts/)
const monorepoRoot = path.resolve(__dirname, '..', '..', '..');
const nodeModules = path.join(monorepoRoot, 'node_modules');

const patches = [
  {
    file: path.join(nodeModules, '@expo/cli/build/src/api/getNativeModuleVersions.js'),
    find: `async function getNativeModuleVersionsAsync(sdkVersion) {
    const fetchAsync = (0, _client.createCachedFetch)({
        cacheDirectory: 'native-modules-cache',
        // 1 minute cache
        ttl: 1000 * 60
    });
    const response = await fetchAsync(\`sdks/\${sdkVersion}/native-modules\`);
    if (!response.ok) {
        throw new _errors.CommandError('API', \`Unexpected response when fetching version info from Expo servers: \${response.statusText}.\`);
    }
    const json = await response.json();
    const data = (0, _client.getResponseDataOrThrow)(json);
    if (!data.length) {
        throw new _errors.CommandError('VERSIONS', 'The bundled native module list from the Expo API is empty');
    }
    return fromBundledNativeModuleList(data);
}`,
    replace: `async function getNativeModuleVersionsAsync(sdkVersion) {
    try {
        const fetchAsync = (0, _client.createCachedFetch)({ cacheDirectory: 'native-modules-cache', ttl: 1000 * 60 });
        const response = await fetchAsync(\`sdks/\${sdkVersion}/native-modules\`);
        if (!response.ok) { return {}; }
        const json = await response.json();
        const data = (0, _client.getResponseDataOrThrow)(json);
        if (!data.length) { return {}; }
        return fromBundledNativeModuleList(data);
    } catch (_e) {
        console.warn('[MIZAN] Remote version check skipped (network unavailable).');
        return {};
    }
}`
  },
  {
    file: path.join(nodeModules, '@expo/cli/build/src/api/getVersions.js'),
    find: `async function getVersionsAsync({ skipCache } = {}) {
    // Reconstruct the cached fetch since caching could be disabled.
    const fetchAsync = (0, _client.createCachedFetch)({
        skipCache,
        cacheDirectory: 'versions-cache',
        // We'll use a 5 minute cache to ensure we stay relatively up to date.
        ttl: 1000 * 60 * 5
    });
    const results = await fetchAsync('versions/latest');
    if (!results.ok) {
        throw new _errors.CommandError('API', \`Unexpected response when fetching version info from Expo servers: \${results.statusText}.\`);
    }
    const json = await results.json();
    return (0, _client.getResponseDataOrThrow)(json);
}`,
    replace: `async function getVersionsAsync({ skipCache } = {}) {
    try {
        const fetchAsync = (0, _client.createCachedFetch)({ skipCache, cacheDirectory: 'versions-cache', ttl: 1000 * 60 * 5 });
        const results = await fetchAsync('versions/latest');
        if (!results.ok) { return {}; }
        const json = await results.json();
        return (0, _client.getResponseDataOrThrow)(json);
    } catch (_e) {
        console.warn('[MIZAN] Remote SDK version check skipped (network unavailable).');
        return {};
    }
}`
  },
  {
    file: path.join(nodeModules, '@expo/cli/build/src/start/doctor/dependencies/getVersionedPackages.js'),
    find: `if (!sdkVersion || !(sdkVersion in sdkVersions)) {\n            debug(\`Skipping versioned dependencies because the SDK version is not found. (sdkVersion: \${sdkVersion}, available: \${Object.keys(sdkVersions).join(', ')})\`);`,
    replace: `if (!sdkVersion || !sdkVersions || !(sdkVersion in sdkVersions)) {\n            debug(\`Skipping versioned dependencies because the SDK version is not found.\`);`
  }
];

let patchedCount = 0;
let alreadyPatchedCount = 0;

for (const patch of patches) {
  if (!fs.existsSync(patch.file)) {
    continue;
  }
  let content = fs.readFileSync(patch.file, 'utf8');
  if (content.includes(patch.replace)) {
    alreadyPatchedCount++;
    continue;
  }
  if (!content.includes(patch.find)) {
    continue;
  }
  content = content.replace(patch.find, patch.replace);
  fs.writeFileSync(patch.file, content, 'utf8');
  patchedCount++;
}

// Verify React 19 is installed correctly
try {
  const reactPkgPath = path.join(monorepoRoot, 'node_modules', 'react', 'package.json');
  if (fs.existsSync(reactPkgPath)) {
    const reactVersion = JSON.parse(fs.readFileSync(reactPkgPath, 'utf8')).version;
    if (!reactVersion.startsWith('19.')) {
      console.warn(`[patch-expo-cli] ⚠️  react@${reactVersion} found in node_modules — expected 19.x`);
    } else {
      console.log(`[patch-expo-cli] ✅ react@${reactVersion} correctly installed.`);
    }
  }
} catch (_e) {
  // Silent fallback for cloud EAS environment
}

if (patchedCount > 0) console.log(`[patch-expo-cli] ✅ ${patchedCount} Expo CLI file(s) patched.`);
if (alreadyPatchedCount > 0) console.log(`[patch-expo-cli] ✓  ${alreadyPatchedCount} file(s) already patched.`);
