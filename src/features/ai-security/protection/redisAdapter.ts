import { RedisClientAdapter } from "./redisLimiter";

export class NodeRedisAdapter implements RedisClientAdapter {
  constructor(private readonly client: any) {}

  async set(key: string, value: string, mode: "PX", ttl: number, nx: "NX"): Promise<string | boolean | null> {
    if (!this.client) return null;
    try {
      // Translate set(key, val, "PX", ttl, "NX") to node-redis client.set(key, val, { PX: ttl, NX: true })
      const res = await this.client.set(key, value, { PX: ttl, NX: true });
      return res; // node-redis returns "OK" or null/undefined
    } catch (err) {
      throw err;
    }
  }

  async eval(script: string, keys: string[], args: string[]): Promise<any> {
    if (!this.client) return null;
    try {
      // Translate eval(script, keys, args) to node-redis client.eval(script, { keys, arguments })
      const res = await this.client.eval(script, {
        keys,
        arguments: args
      });
      return res;
    } catch (err) {
      throw err;
    }
  }

  async get(key: string): Promise<string | null> {
    if (!this.client) return null;
    return this.client.get(key);
  }

  async del(key: string): Promise<number> {
    if (!this.client) return 0;
    const res = await this.client.del(key);
    return typeof res === "number" ? res : (res ? 1 : 0);
  }
}
