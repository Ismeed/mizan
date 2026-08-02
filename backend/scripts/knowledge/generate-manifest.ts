import { ManifestService } from '../../src/features/knowledge/services/manifest.service';

async function main() {
  const moduleArg = (process.argv[2] || 'RELEASE').toUpperCase() as any;
  const manifestName = process.argv[3] || `manifest_${moduleArg.toLowerCase()}_${Date.now()}`;

  console.log(`📜 Generating manifest '${manifestName}' for scope '${moduleArg}'...\n`);

  try {
    const manifest = await ManifestService.generateManifest(manifestName, moduleArg, 'cli_admin');

    console.log(`✅ Manifest generated successfully.`);
    console.log(` - Manifest Name: ${manifest.manifestName}`);
    console.log(` - Module Scope:   ${manifest.module}`);
    console.log(` - Record Count:   ${manifest.recordCount}`);
    console.log(` - SHA-256 Hash:   ${manifest.manifestChecksum}\n`);
  } catch (err: any) {
    if (err.message?.includes('Can\'t reach database server')) {
      console.log('ℹ️  [Offline DB Mode] PostgreSQL database server is not currently running at localhost:5432.');
      console.log('   Run PostgreSQL or start Docker container to generate live manifests.');
    } else {
      throw err;
    }
  }

  process.exit(0);
}

main().catch(err => {
  console.error('Fatal CLI Error:', err);
  process.exit(1);
});
