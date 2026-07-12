import { getActiveCorpusPointerRepository } from '../../src/features/repertory/repositories/ActiveCorpusPointerRepository';
import { getRuntimeEnvironment } from '../../src/features/repertory/config/runtimeEnv';

// Parse arguments
function parseArgs() {
  const args: Record<string, string> = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].substring(2);
      const val = argv[i + 1];
      if (val && !val.startsWith('--')) {
        args[key] = val;
        i++;
      } else {
        args[key] = 'true';
      }
    }
  }
  return args;
}

async function main() {
  const args = parseArgs();
  const clientName = args.client;
  const action = args.action;
  const version = args.version;

  if (process.env.REPERTORY_TEST_ENV === 'test-local-file') {
    (process.env as any).NODE_ENV = 'test';
    process.env.TEST_POINTER_REPO = 'local-file';
  } else {
    process.env.REPERTORY_ENV = 'emulator';
    process.env.REPERTORY_RUNTIME_MODE = 'emulator';
    process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
    process.env.FIRESTORE_PROJECT_ID = 'homeo-healthcare-emulator';
  }

  getRuntimeEnvironment();
  const repo = getActiveCorpusPointerRepository();

  if (action === 'read') {
    const active = await repo.getActive();
    console.log(JSON.stringify({
      client: clientName,
      activeVersion: active?.activeVersion || null,
      contentHash: active?.contentHash || null
    }));
  } else if (action === 'activate') {
    if (!version) throw new Error("Missing version for activate");
    await repo.activate({
      version,
      previousVersion: "v1.1.0",
      contentHash: `hash-${version}`,
      actorUid: `actor-${clientName}`,
      actorRole: "release-operator",
      reason: `Client ${clientName} activation`,
      transactionId: `tx_${clientName}_${Date.now()}`,
      auditLogId: `audit_${clientName}_${Date.now()}`
    });
    console.log(JSON.stringify({ client: clientName, status: "activated", version }));
  } else if (action === 'rollback') {
    if (!version) throw new Error("Missing version for rollback");
    await repo.rollback({
      version,
      previousVersion: "v1.2.0",
      contentHash: `hash-${version}`,
      actorUid: `actor-${clientName}`,
      actorRole: "release-operator",
      reason: `Client ${clientName} rollback`,
      transactionId: `tx_${clientName}_${Date.now()}`,
      auditLogId: `audit_${clientName}_${Date.now()}`
    });
    console.log(JSON.stringify({ client: clientName, status: "rolledback", version }));
  } else {
    console.error("Unknown action:", action);
    process.exit(1);
  }
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
