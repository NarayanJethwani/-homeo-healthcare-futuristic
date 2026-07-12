import assert from 'assert';
import { execSync } from 'child_process';

import * as net from 'net';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';

function checkEmulatorUp(host: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(200);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.on('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
}

async function run() {
  const emulatorUp = await checkEmulatorUp('127.0.0.1', 8080);
  const useMock = !emulatorUp;

  const sharedTempRoot = path.join(os.tmpdir(), `homeo-pointer-test-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`);
  fs.mkdirSync(sharedTempRoot, { recursive: true });

  // Pre-test deletion of local active_pointer.json to ensure starting from a clean state
  const localPointerPath = path.join(sharedTempRoot, 'published', 'active_pointer.json');
  if (fs.existsSync(localPointerPath)) {
    fs.unlinkSync(localPointerPath);
  }

  if (useMock) {
    console.log("⚠️ Firestore Emulator not running. Using mock/local-file consistency environment.");
  }

  function runClient(client: string, action: string, version?: string): any {
    const tsnodeCmd = `npx ts-node -P tests/tsconfig.test.json -r tsconfig-paths/register tests/helpers/pointerClient.ts --client ${client} --action ${action} ${version ? `--version ${version}` : ''}`;
    const output = execSync(tsnodeCmd, {
      env: {
        ...process.env,
        REPERTORY_ENV: useMock ? 'test' : 'emulator',
        REPERTORY_RUNTIME_MODE: useMock ? 'test' : 'emulator',
        REPERTORY_TEST_ENV: useMock ? 'test-local-file' : 'emulator',
        REPERTORY_USE_MOCK_FIRESTORE: useMock ? 'true' : 'false',
        REPERTORY_TEST_ARTIFACT_ROOT: sharedTempRoot,
        FIRESTORE_EMULATOR_HOST: useMock ? undefined : '127.0.0.1:8080',
        FIRESTORE_PROJECT_ID: useMock ? 'mock-project-id' : 'homeo-healthcare-emulator'
      }
    }).toString();
    const lines = output.split('\n');
    const jsonLine = lines.find(line => line.trim().startsWith('{'));
    if (!jsonLine) {
      throw new Error(`Failed to find JSON output in client process stdout. Raw output:\n${output}`);
    }
    return JSON.parse(jsonLine.trim());
  }
  try {
    console.log("🚀 Running Multi-Process Active Pointer Consistency Tests...");
    console.log(`Emulator Host: ${process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080'}`);
    console.log(`Emulator Project ID: ${process.env.FIRESTORE_PROJECT_ID || 'homeo-healthcare-emulator'}`);

    let passed = 0;

    // Initialize pointer to v1.1.0 using Client A
    const initRes = runClient('A', 'activate', 'v1.1.0');
    assert.strictEqual(initRes.version, 'v1.1.0');

    // 1. Process A & B both read v1.1.0
    const readA1 = runClient('A', 'read');
    const readB1 = runClient('B', 'read');
    assert.strictEqual(readA1.activeVersion, 'v1.1.0');
    assert.strictEqual(readB1.activeVersion, 'v1.1.0');
    console.log("✅ Step 1: Both clients successfully read initial version v1.1.0.");
    passed++;

    // 2. Process A activates v1.2.0, measure propagation latency
    const startTime = Date.now();
    const activateA = runClient('A', 'activate', 'v1.2.0');
    assert.strictEqual(activateA.version, 'v1.2.0');

    const readB2 = runClient('B', 'read');
    const latency = Date.now() - startTime;
    assert.strictEqual(readB2.activeVersion, 'v1.2.0');
    console.log(`✅ Step 2: Client B observed v1.2.0 activated by Client A. Latency: ${latency}ms`);
    passed++;

    // 3. Process B rolls back to v1.1.0
    const rollbackB = runClient('B', 'rollback', 'v1.1.0');
    assert.strictEqual(rollbackB.version, 'v1.1.0');

    const readA2 = runClient('A', 'read');
    assert.strictEqual(readA2.activeVersion, 'v1.1.0');
    console.log("✅ Step 3: Client A observed rollback to v1.1.0 initiated by Client B.");
    passed++;

    // 4. Process A reactivates v1.2.0
    const reactivateA = runClient('A', 'activate', 'v1.2.0');
    assert.strictEqual(reactivateA.version, 'v1.2.0');

    const readB3 = runClient('B', 'read');
    assert.strictEqual(readB3.activeVersion, 'v1.2.0');
    console.log("✅ Step 4: Client B observed reactivation to v1.2.0.");
    passed++;

    console.log(`\n🎉 Multi-Process Consistency Tests Passed: ${passed}/4`);
  } finally {
    if (fs.existsSync(sharedTempRoot)) {
      fs.rmSync(sharedTempRoot, { recursive: true, force: true });
    }
  }
}

run().catch(err => {
  console.error("❌ Multi-Process Consistency Test Failed:", err);
  process.exit(1);
});
