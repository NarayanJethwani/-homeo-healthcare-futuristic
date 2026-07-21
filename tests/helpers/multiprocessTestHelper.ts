import { spawn } from "child_process";
import path from "path";

export interface MultiprocessTestResult {
  pid: number;
  status: string;
  exitCode: number | null;
  output: string;
}

export class MultiprocessTestHelper {
  /**
   * Run a child node script concurrently across N worker processes.
   */
  static async runConcurrentWorkers(
    workerScriptPath: string,
    workerCount: number = 3,
    extraEnv: Record<string, string> = {},
    args: string[] = []
  ): Promise<MultiprocessTestResult[]> {
    const promises: Promise<MultiprocessTestResult>[] = [];

    for (let i = 0; i < workerCount; i++) {
      promises.push(
        new Promise<MultiprocessTestResult>((resolve) => {
          const projectRoot = path.resolve(__dirname, "../../");
          const child = spawn("npx", [
            "ts-node",
            "-P", "tests/tsconfig.test.json",
            "-r", "tsconfig-paths/register",
            workerScriptPath,
            ...args
          ], {
            cwd: projectRoot,
            env: {
              ...process.env,
              ...extraEnv,
              WORKER_ID: String(i)
            }
          });

          let stdout = "";
          let stderr = "";

          child.stdout?.on("data", (data) => {
            stdout += data.toString();
          });

          child.stderr?.on("data", (data) => {
            stderr += data.toString();
          });

          child.on("close", (code) => {
            resolve({
              pid: child.pid || 0,
              status: code === 0 ? "success" : "failed",
              exitCode: code,
              output: stdout + "\n" + stderr
            });
          });
        })
      );
    }

    return Promise.all(promises);
  }
}
