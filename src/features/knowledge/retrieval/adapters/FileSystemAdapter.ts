import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";

export interface AtomicLockResult {
  acquired: boolean;
  inode: number;
}

export interface AtomicUpdateResult {
  updated: boolean;
  inode: number;
}

export interface FileSystemAdapter {
  mkdirSync(dirPath: string, options?: { recursive?: boolean; mode?: number }): void;
  existsSync(filePath: string): boolean;
  readFileSync(filePath: string, encoding: "utf-8"): string;
  writeFileSync(filePath: string, data: string, options?: { encoding?: "utf-8"; mode?: number }): void;
  unlinkSync(filePath: string): void;
  renameSync(oldPath: string, newPath: string): void;
  realpathSync(filePath: string): string;
  lstatSync(filePath: string): fs.Stats;
  readdirSync(dirPath: string): string[];
  readdirBoundedSync(dirPath: string, maxEntries: number): string[];
  openSync(filePath: string, flags: string, mode?: number): number;
  closeSync(fd: number): void;
  fsyncSync(fd: number): void;
  fstatSync(fd: number): fs.Stats;
  chmodSync(filePath: string, mode: number): void;

  atomicAcquireLock(lockPath: string, lockContent: string): AtomicLockResult;
  atomicUpdateLock(lockPath: string, ownerToken: string, expectedInode: number, newLockContent: string): AtomicUpdateResult;
  atomicReclaimExpiredLock(
    lockPath: string,
    expectedOwnerToken: string,
    expectedInode: number,
    expectedExpiresAt: number,
    newLockContent: string
  ): AtomicLockResult;
  atomicReleaseLock(lockPath: string, ownerToken: string, expectedInode: number): boolean;
}

export class NodeFileSystemAdapter implements FileSystemAdapter {
  mkdirSync(dirPath: string, options?: { recursive?: boolean; mode?: number }): void {
    fs.mkdirSync(dirPath, { ...options, mode: options?.mode ?? 0o700 });
  }

  existsSync(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  readFileSync(filePath: string, encoding: "utf-8"): string {
    return fs.readFileSync(filePath, encoding);
  }

  writeFileSync(filePath: string, data: string, options?: { encoding?: "utf-8"; mode?: number }): void {
    const mode = options?.mode ?? 0o600;
    const fd = fs.openSync(filePath, "w", mode);
    try {
      fs.writeFileSync(fd, data, options?.encoding || "utf-8");
      fs.fsyncSync(fd);
    } finally {
      fs.closeSync(fd);
    }
  }

  unlinkSync(filePath: string): void {
    fs.unlinkSync(filePath);
  }

  renameSync(oldPath: string, newPath: string): void {
    fs.renameSync(oldPath, newPath);
  }

  realpathSync(filePath: string): string {
    return fs.realpathSync(filePath);
  }

  lstatSync(filePath: string): fs.Stats {
    return fs.lstatSync(filePath);
  }

  readdirSync(dirPath: string): string[] {
    return fs.readdirSync(dirPath);
  }

  readdirBoundedSync(dirPath: string, maxEntries: number): string[] {
    if (maxEntries <= 0) return [];
    let dir: fs.Dir;
    try {
      dir = fs.opendirSync(dirPath);
    } catch {
      return [];
    }

    const entries: string[] = [];
    try {
      let dirent: fs.Dirent | null;
      while (entries.length < maxEntries && (dirent = dir.readSync()) !== null) {
        entries.push(dirent.name);
      }
    } finally {
      try {
        dir.closeSync();
      } catch {}
    }

    return entries;
  }

  openSync(filePath: string, flags: string, mode?: number): number {
    return fs.openSync(filePath, flags, mode ?? 0o600);
  }

  closeSync(fd: number): void {
    fs.closeSync(fd);
  }

  fsyncSync(fd: number): void {
    fs.fsyncSync(fd);
  }

  fstatSync(fd: number): fs.Stats {
    return fs.fstatSync(fd);
  }

  chmodSync(filePath: string, mode: number): void {
    fs.chmodSync(filePath, mode);
  }

  atomicAcquireLock(lockPath: string, lockContent: string): AtomicLockResult {
    let fd: number;
    try {
      fd = fs.openSync(lockPath, "wx", 0o600);
    } catch (err: any) {
      if (err.code === "EEXIST") {
        return { acquired: false, inode: 0 };
      }
      throw err;
    }

    try {
      fs.writeFileSync(fd, lockContent, "utf-8");
      fs.fsyncSync(fd);
      const stat = fs.fstatSync(fd);
      return { acquired: true, inode: stat.ino };
    } finally {
      fs.closeSync(fd);
    }
  }

  atomicUpdateLock(
    lockPath: string,
    ownerToken: string,
    expectedInode: number,
    newLockContent: string
  ): AtomicUpdateResult {
    if (!fs.existsSync(lockPath)) {
      return { updated: false, inode: 0 };
    }

    let currentStat: fs.Stats;
    try {
      currentStat = fs.lstatSync(lockPath);
    } catch {
      return { updated: false, inode: 0 };
    }

    if (expectedInode > 0 && currentStat.ino !== expectedInode) {
      return { updated: false, inode: 0 };
    }

    let fd: number;
    try {
      fd = fs.openSync(lockPath, "r+", 0o600);
    } catch {
      return { updated: false, inode: 0 };
    }

    try {
      const fdStat = fs.fstatSync(fd);
      if (expectedInode > 0 && fdStat.ino !== expectedInode) {
        return { updated: false, inode: 0 };
      }

      const recheckStat = fs.lstatSync(lockPath);
      if (recheckStat.ino !== fdStat.ino) {
        return { updated: false, inode: 0 };
      }

      const content = fs.readFileSync(fd, "utf-8");
      let parsed: any = null;
      try {
        parsed = JSON.parse(content);
      } catch {
        return { updated: false, inode: 0 };
      }

      if (!parsed || parsed.ownerToken !== ownerToken) {
        return { updated: false, inode: 0 };
      }

      fs.ftruncateSync(fd, 0);
      fs.writeSync(fd, newLockContent, 0, "utf-8");
      fs.fsyncSync(fd);

      // Post-write lstat verification to check if inode is still installed at lockPath
      const postStat = fs.lstatSync(lockPath);
      if (postStat.ino !== fdStat.ino) {
        return { updated: false, inode: 0 };
      }

      const finalStat = fs.fstatSync(fd);
      return { updated: true, inode: finalStat.ino };
    } catch {
      return { updated: false, inode: 0 };
    } finally {
      fs.closeSync(fd);
    }
  }

  atomicReclaimExpiredLock(
    lockPath: string,
    expectedOwnerToken: string,
    expectedInode: number,
    expectedExpiresAt: number,
    newLockContent: string
  ): AtomicLockResult {
    if (!fs.existsSync(lockPath)) {
      return { acquired: false, inode: 0 };
    }

    const tombstoneId = crypto.randomBytes(8).toString("hex");
    const tombstonePath = lockPath + ".tombstone." + tombstoneId;

    try {
      // 1. Atomically isolate the lock file
      fs.renameSync(lockPath, tombstonePath);
    } catch {
      return { acquired: false, inode: 0 };
    }

    // 2. Prepare the marker payload
    const markerPayload = JSON.stringify({
      ownerToken: "marker",
      expiresAt: Date.now() + 5000, // Expires in 5 seconds
      tombstoneId: tombstoneId,
      phase: "reclaim"
    });

    const tempMarkerPath = lockPath + ".marker.tmp." + crypto.randomBytes(8).toString("hex");
    let markerFd: number;
    let markerStat: fs.Stats;

    try {
      // 3. Write/fsync unique temporary marker durably
      const tempFd = fs.openSync(tempMarkerPath, "w", 0o600);
      try {
        fs.writeSync(tempFd, markerPayload, 0, "utf-8");
        fs.fsyncSync(tempFd);
      } finally {
        fs.closeSync(tempFd);
      }
      // 4. Install at lockPath with atomic link (no-replace)
      fs.linkSync(tempMarkerPath, lockPath);
      fs.unlinkSync(tempMarkerPath);

      markerFd = fs.openSync(lockPath, "r+");
      markerStat = fs.fstatSync(markerFd);
    } catch (err: any) {
      try { fs.unlinkSync(tempMarkerPath); } catch {}
      if (err.code === "EEXIST") {
        // Distinguish marker-creation EEXIST from other I/O failures
        try { fs.unlinkSync(tombstonePath); } catch {}
        return { acquired: false, inode: 0 };
      } else {
        // Other I/O failure: restore the tombstone
        try {
          if (fs.existsSync(tombstonePath) && !fs.existsSync(lockPath)) {
            fs.renameSync(tombstonePath, lockPath);
          }
        } catch {}
        return { acquired: false, inode: 0 };
      }
    }

    try {
      // 5. Validate isolated inode and content
      const tombstoneStat = fs.lstatSync(tombstonePath);
      const content = fs.readFileSync(tombstonePath, "utf-8");
      const parsed = JSON.parse(content);

      let isValid = false;
      let isCrashedMarker = false;

      if (
        parsed &&
        parsed.ownerToken === "marker" &&
        typeof parsed.expiresAt === "number" &&
        Date.now() > parsed.expiresAt &&
        (parsed.phase === "reclaim" || parsed.phase === "release")
      ) {
        if (parsed.tombstoneId && /^[0-9a-f]{16}$/i.test(parsed.tombstoneId)) {
          const lockDir = path.dirname(path.resolve(lockPath));
          const lockBasename = path.basename(lockPath);
          const reconstructed = path.join(lockDir, `${lockBasename}.tombstone.${parsed.tombstoneId}`);

          let markerTombstoneValid = false;
          try {
            const stat = fs.lstatSync(reconstructed);
            if (!stat.isSymbolicLink()) {
              markerTombstoneValid = true;
            }
          } catch (err: any) {
            if (err.code === "ENOENT") {
              markerTombstoneValid = true;
            }
          }

          if (markerTombstoneValid) {
            isCrashedMarker = true;
            isValid = true;
          }
        }
      } else if (
        parsed &&
        parsed.ownerToken === expectedOwnerToken &&
        parsed.expiresAt === expectedExpiresAt &&
        Date.now() > parsed.expiresAt
      ) {
        if (expectedInode <= 0 || tombstoneStat.ino === expectedInode) {
          isValid = true;
        }
      }

      if (!isValid) {
        fs.closeSync(markerFd);
        fs.renameSync(tombstonePath, lockPath);
        return { acquired: false, inode: 0 };
      }

      // If it's a crashed marker, clean up its referenced tombstone securely
      if (isCrashedMarker && parsed.tombstoneId) {
        this.safeUnlinkTombstone(lockPath, parsed.tombstoneId);
      }

      // 6. Overwrite marker with the new lock payload
      fs.ftruncateSync(markerFd, 0);
      fs.writeSync(markerFd, newLockContent, 0, "utf-8");
      fs.fsyncSync(markerFd);
      fs.closeSync(markerFd);

      fs.unlinkSync(tombstonePath);
      return { acquired: true, inode: markerStat.ino };
    } catch {
      try { fs.closeSync(markerFd); } catch {}
      try {
        if (fs.existsSync(tombstonePath) && !fs.existsSync(lockPath)) {
          fs.renameSync(tombstonePath, lockPath);
        }
      } catch {}
      return { acquired: false, inode: 0 };
    }
  }

  atomicReleaseLock(lockPath: string, ownerToken: string, expectedInode: number): boolean {
    if (!fs.existsSync(lockPath)) return false;

    const tombstoneId = crypto.randomBytes(8).toString("hex");
    const tombstonePath = lockPath + ".tombstone." + tombstoneId;

    try {
      // 1. Atomically isolate the lock file
      fs.renameSync(lockPath, tombstonePath);
    } catch {
      return false;
    }

    const markerPayload = JSON.stringify({
      ownerToken: "marker",
      expiresAt: Date.now() + 5000,
      tombstoneId: tombstoneId,
      phase: "release"
    });

    const tempMarkerPath = lockPath + ".marker.tmp." + crypto.randomBytes(8).toString("hex");
    let markerFd: number;
    try {
      const tempFd = fs.openSync(tempMarkerPath, "w", 0o600);
      try {
        fs.writeSync(tempFd, markerPayload, 0, "utf-8");
        fs.fsyncSync(tempFd);
      } finally {
        fs.closeSync(tempFd);
      }
      fs.linkSync(tempMarkerPath, lockPath);
      fs.unlinkSync(tempMarkerPath);

      markerFd = fs.openSync(lockPath, "r+");
    } catch (err: any) {
      try { fs.unlinkSync(tempMarkerPath); } catch {}
      if (err.code === "EEXIST") {
        try { fs.unlinkSync(tombstonePath); } catch {}
        return false;
      } else {
        try {
          if (fs.existsSync(tombstonePath) && !fs.existsSync(lockPath)) {
            fs.renameSync(tombstonePath, lockPath);
          }
        } catch {}
        return false;
      }
    }

    try {
      // 3. Validate isolated inode and content
      const tombstoneStat = fs.lstatSync(tombstonePath);
      const content = fs.readFileSync(tombstonePath, "utf-8");
      const parsed = JSON.parse(content);

      let isValid = false;
      let isCrashedMarker = false;

      if (
        parsed &&
        parsed.ownerToken === "marker" &&
        typeof parsed.expiresAt === "number" &&
        Date.now() > parsed.expiresAt &&
        parsed.phase === "release"
      ) {
        if (parsed.tombstoneId && /^[0-9a-f]{16}$/i.test(parsed.tombstoneId)) {
          const lockDir = path.dirname(path.resolve(lockPath));
          const lockBasename = path.basename(lockPath);
          const reconstructed = path.join(lockDir, `${lockBasename}.tombstone.${parsed.tombstoneId}`);

          let markerTombstoneValid = false;
          try {
            const stat = fs.lstatSync(reconstructed);
            if (!stat.isSymbolicLink()) {
              markerTombstoneValid = true;
            }
          } catch (err: any) {
            if (err.code === "ENOENT") {
              markerTombstoneValid = true;
            }
          }

          if (markerTombstoneValid) {
            isCrashedMarker = true;
            isValid = true;
          }
        }
      } else if (parsed && parsed.ownerToken === ownerToken) {
        if (expectedInode <= 0 || tombstoneStat.ino === expectedInode) {
          isValid = true;
        }
      }

      if (!isValid) {
        fs.closeSync(markerFd);
        fs.renameSync(tombstonePath, lockPath);
        return false;
      }

      if (isCrashedMarker && parsed.tombstoneId) {
        this.safeUnlinkTombstone(lockPath, parsed.tombstoneId);
      }

      // 4. Delete marker and tombstone file
      fs.closeSync(markerFd);
      fs.unlinkSync(lockPath);
      fs.unlinkSync(tombstonePath);
      return true;
    } catch {
      try {
        fs.closeSync(markerFd);
      } catch {}
      try {
        if (fs.existsSync(tombstonePath) && !fs.existsSync(lockPath)) {
          fs.renameSync(tombstonePath, lockPath);
        }
      } catch {}
      return false;
    }
  }

  private safeUnlinkTombstone(lockPath: string, tombstoneId: string): void {
    if (!tombstoneId || typeof tombstoneId !== "string") return;
    if (!/^[0-9a-f]{16}$/i.test(tombstoneId)) return;

    const lockDir = path.dirname(path.resolve(lockPath));
    const lockBasename = path.basename(lockPath);
    const reconstructed = path.join(lockDir, `${lockBasename}.tombstone.${tombstoneId}`);

    const resolved = path.resolve(reconstructed);
    if (path.dirname(resolved) !== lockDir) return;

    try {
      const stat = fs.lstatSync(resolved);
      if (stat.isSymbolicLink()) return;
      fs.unlinkSync(resolved);
    } catch {}
  }
}

/**
 * In-memory filesystem adapter for unit/integration testing environments.
 */
export class MemoryFileSystemAdapter implements FileSystemAdapter {
  private files = new Map<string, { content: string; inode: number; mode: number }>();
  private directories = new Map<string, { mode: number }>();
  private nextInode = 1000;

  mkdirSync(dirPath: string, options?: { recursive?: boolean; mode?: number }): void {
    if (options?.recursive) {
      const parts = dirPath.split(path.sep).filter(Boolean);
      let curr = dirPath.startsWith(path.sep) ? path.sep : "";
      for (const part of parts) {
        curr = path.join(curr, part);
        this.directories.set(curr, { mode: options?.mode ?? 0o700 });
      }
    } else {
      this.directories.set(dirPath, { mode: options?.mode ?? 0o700 });
    }
  }

  existsSync(filePath: string): boolean {
    return this.files.has(filePath) || this.directories.has(filePath);
  }

  readFileSync(filePath: string, encoding: "utf-8"): string {
    const item = this.files.get(filePath);
    if (!item) {
      throw new Error(`ENOENT: no such file or directory, open '${filePath}'`);
    }
    return item.content;
  }

  writeFileSync(filePath: string, data: string, options?: { encoding?: "utf-8"; mode?: number }): void {
    const existing = this.files.get(filePath);
    const inode = existing ? existing.inode : ++this.nextInode;
    this.files.set(filePath, { content: data, inode, mode: options?.mode ?? 0o600 });
  }

  unlinkSync(filePath: string): void {
    this.files.delete(filePath);
  }

  renameSync(oldPath: string, newPath: string): void {
    const item = this.files.get(oldPath);
    if (item) {
      this.files.set(newPath, item);
      this.files.delete(oldPath);
    }
  }

  realpathSync(filePath: string): string {
    return filePath;
  }

  lstatSync(filePath: string): fs.Stats {
    const item = this.files.get(filePath);
    const isDir = this.directories.has(filePath);
    const ino = item ? item.inode : 999;
    return {
      isFile: () => !isDir,
      isDirectory: () => isDir,
      isSymbolicLink: () => false,
      size: item ? item.content.length : 0,
      ino
    } as any;
  }

  readdirSync(dirPath: string): string[] {
    const list = new Set<string>();
    const prefix = dirPath.endsWith(path.sep) ? dirPath : dirPath + path.sep;

    for (const key of this.files.keys()) {
      if (key.startsWith(prefix)) {
        const sub = key.substring(prefix.length);
        if (sub && !sub.includes(path.sep)) {
          list.add(sub);
        }
      }
    }

    for (const key of this.directories.keys()) {
      if (key !== dirPath && key.startsWith(prefix)) {
        const sub = key.substring(prefix.length);
        if (sub && !sub.includes(path.sep)) {
          list.add(sub);
        }
      }
    }

    return Array.from(list);
  }

  readdirBoundedSync(dirPath: string, maxEntries: number): string[] {
    if (maxEntries <= 0) return [];
    const list: string[] = [];
    const prefix = dirPath.endsWith(path.sep) ? dirPath : dirPath + path.sep;

    for (const key of this.files.keys()) {
      if (list.length >= maxEntries) break;
      if (key.startsWith(prefix)) {
        const sub = key.substring(prefix.length);
        if (sub && !sub.includes(path.sep)) {
          list.push(sub);
        }
      }
    }

    for (const key of this.directories.keys()) {
      if (list.length >= maxEntries) break;
      if (key !== dirPath && key.startsWith(prefix)) {
        const sub = key.substring(prefix.length);
        if (sub && !sub.includes(path.sep)) {
          if (!list.includes(sub)) {
            list.push(sub);
          }
        }
      }
    }

    return list;
  }

  openSync(filePath: string, flags: string, mode?: number): number {
    return 100;
  }

  closeSync(fd: number): void {}

  fsyncSync(fd: number): void {}

  fstatSync(fd: number): fs.Stats {
    return {
      size: 0,
      ino: 1000
    } as any;
  }

  chmodSync(filePath: string, mode: number): void {}

  atomicAcquireLock(lockPath: string, lockContent: string): AtomicLockResult {
    if (this.files.has(lockPath)) {
      return { acquired: false, inode: 0 };
    }
    const inode = ++this.nextInode;
    this.files.set(lockPath, { content: lockContent, inode, mode: 0o600 });
    return { acquired: true, inode };
  }

  atomicUpdateLock(
    lockPath: string,
    ownerToken: string,
    expectedInode: number,
    newLockContent: string
  ): AtomicUpdateResult {
    const item = this.files.get(lockPath);
    if (!item) return { updated: false, inode: 0 };
    if (expectedInode > 0 && item.inode !== expectedInode) return { updated: false, inode: 0 };

    try {
      const parsed = JSON.parse(item.content);
      if (!parsed || parsed.ownerToken !== ownerToken) {
        return { updated: false, inode: 0 };
      }
    } catch {
      return { updated: false, inode: 0 };
    }

    item.content = newLockContent;
    return { updated: true, inode: item.inode };
  }

  atomicReclaimExpiredLock(
    lockPath: string,
    expectedOwnerToken: string,
    expectedInode: number,
    expectedExpiresAt: number,
    newLockContent: string
  ): AtomicLockResult {
    const item = this.files.get(lockPath);
    if (!item) return { acquired: false, inode: 0 };
    if (expectedInode > 0 && item.inode !== expectedInode) return { acquired: false, inode: 0 };

    try {
      const parsed = JSON.parse(item.content);
      if (
        !parsed ||
        parsed.ownerToken !== expectedOwnerToken ||
        parsed.expiresAt !== expectedExpiresAt ||
        Date.now() <= parsed.expiresAt
      ) {
        return { acquired: false, inode: 0 };
      }
    } catch {
      return { acquired: false, inode: 0 };
    }

    item.content = newLockContent;
    return { acquired: true, inode: item.inode };
  }

  atomicReleaseLock(lockPath: string, ownerToken: string, expectedInode: number): boolean {
    const item = this.files.get(lockPath);
    if (!item) return false;
    if (expectedInode > 0 && item.inode !== expectedInode) return false;

    try {
      const parsed = JSON.parse(item.content);
      if (!parsed || parsed.ownerToken !== ownerToken) return false;
    } catch {
      return false;
    }

    this.files.delete(lockPath);
    return true;
  }
}

export function validateAndCanonicalizePath(
  inputPath: string,
  rootPath: string = os.homedir(),
  fsAdapter: FileSystemAdapter = new NodeFileSystemAdapter()
): string {
  const expandedInput = inputPath.startsWith("~")
    ? path.join(os.homedir(), inputPath.slice(1))
    : inputPath;

  let expandedRoot = rootPath.startsWith("~")
    ? path.join(os.homedir(), rootPath.slice(1))
    : rootPath;

  const canonicalRoot = path.resolve(expandedRoot);
  const absoluteInput = path.resolve(expandedInput);

  if (absoluteInput !== canonicalRoot && !absoluteInput.startsWith(canonicalRoot + path.sep)) {
    throw new Error(`Security Violation: Path '${inputPath}' escapes canonical root '${rootPath}'.`);
  }

  // Component-wise no-symlink check along path from root
  const rel = path.relative(canonicalRoot, absoluteInput);
  const segments = rel ? rel.split(path.sep).filter(Boolean) : [];

  let current = canonicalRoot;

  // Check root itself
  if (fsAdapter.existsSync(current)) {
    const rootStat = fsAdapter.lstatSync(current);
    if (rootStat.isSymbolicLink()) {
      throw new Error(`Security Violation: Root directory '${current}' is a symbolic link.`);
    }
  }

  for (const seg of segments) {
    current = path.join(current, seg);
    if (fsAdapter.existsSync(current)) {
      const stat = fsAdapter.lstatSync(current);
      if (stat.isSymbolicLink()) {
        throw new Error(`Security Violation: Path component '${current}' is a symbolic link.`);
      }
    }
  }

  return absoluteInput;
}

export function fsyncParentDirectory(
  filePath: string,
  fsAdapter: FileSystemAdapter = new NodeFileSystemAdapter()
): void {
  const parentDir = path.dirname(filePath);
  if (fsAdapter.existsSync(parentDir)) {
    try {
      const pFd = fsAdapter.openSync(parentDir, "r");
      fsAdapter.fsyncSync(pFd);
      fsAdapter.closeSync(pFd);
    } catch {}
  }
}
