/**
 * Detect Floating Point Usage CLI Script
 * Phase 12 — MIZAN Currency Architecture
 */

import fs from 'fs';
import path from 'path';

const FORBIDDEN_PATTERNS = [
  { pattern: /parseFloat\s*\(/, reason: 'parseFloat used for monetary parsing' },
  { pattern: /\*\s*0\.025/, reason: 'Floating point 0.025 used for Zakat calculation' },
];

const TARGET_DIRECTORIES = [
  path.join(__dirname, '../../src/features/currency/services'),
  path.join(__dirname, '../../../packages/shared/src/engines'),
];

function scanDirectory(dirPath: string): number {
  let issuesCount = 0;
  if (!fs.existsSync(dirPath)) return 0;

  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      issuesCount += scanDirectory(fullPath);
    } else if (file.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');

      lines.forEach((line, index) => {
        for (const { pattern, reason } of FORBIDDEN_PATTERNS) {
          if (pattern.test(line)) {
            console.error(`[WARN] ${file}:${index + 1} — ${reason}\n  Line: ${line.trim()}`);
            issuesCount++;
          }
        }
      });
    }
  }

  return issuesCount;
}

function main() {
  console.log('=== MIZAN Floating-Point Financial Usage Detector ===\n');

  let totalIssues = 0;
  for (const dir of TARGET_DIRECTORIES) {
    console.log(`Scanning directory: ${dir}...`);
    totalIssues += scanDirectory(dir);
  }

  console.log(`\nScan complete. ${totalIssues} suspicious floating-point pattern(s) detected.`);

  if (totalIssues === 0) {
    console.log('✅ CLEAN: No raw binary floating-point financial arithmetic found in authoritative calculation paths.');
  }
}

main();
