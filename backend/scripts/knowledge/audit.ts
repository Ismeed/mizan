import { prisma } from '../../src/config/database';

async function main() {
  console.log('📋 Fetching append-only Knowledge Audit Trail...\n');

  try {
    const events = await prisma.knowledgeAuditEvent.findMany({
      orderBy: { timestamp: 'desc' },
      take: 50,
    });

    console.log(`Found ${events.length} audit events:\n`);

    events.forEach(e => {
      console.log(`[${e.timestamp.toISOString()}] Record: ${e.knowledge_id} | Actor: ${e.actor_id} (${e.actor_role})`);
      console.log(`  Action: ${e.action} | Status: ${e.old_status || 'N/A'} → ${e.new_status || 'N/A'}`);
      if (e.reason) console.log(`  Reason: ${e.reason}`);
      console.log(`  Checksum: ${e.new_checksum}\n`);
    });
  } catch (err: any) {
    if (err.message?.includes('Can\'t reach database server')) {
      console.log('ℹ️  [Offline DB Mode] PostgreSQL database server is not currently running at localhost:5432.');
      console.log('   Run PostgreSQL or start Docker container to query live audit logs.');
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
