import { prisma } from '../../src/config/database';

async function main() {
  console.log('📊 Generating Knowledge Repository Status Report...\n');

  try {
    const total = await prisma.knowledgeRecord.count();
    const byStatus = await prisma.knowledgeRecord.groupBy({
      by: ['status'],
      _count: { status: true },
    });

    const byModule = await prisma.knowledgeRecord.groupBy({
      by: ['module'],
      _count: { module: true },
    });

    console.log(`Total Knowledge Records: ${total}\n`);

    console.log('Breakdown by Status:');
    byStatus.forEach(s => {
      console.log(` - ${s.status.padEnd(20)}: ${s._count.status}`);
    });

    console.log('\nBreakdown by Module:');
    byModule.forEach(m => {
      console.log(` - ${m.module.padEnd(20)}: ${m._count.module}`);
    });

    console.log('\n✅ Knowledge Repository Report Completed.');
  } catch (err: any) {
    if (err.message?.includes('Can\'t reach database server')) {
      console.log('ℹ️  [Offline DB Mode] PostgreSQL database server is not currently running at localhost:5432.');
      console.log('   Run PostgreSQL or start Docker container to query live database records.');
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
