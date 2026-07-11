import fs from 'fs';
import path from 'path';

export class SourceCorpusRepository {
  private static getSourceDir(): string {
    return path.join(process.cwd(), 'data', 'repertory', 'source');
  }

  static async ensureDirectoriesExist(): Promise<void> {
    const dir = this.getSourceDir();
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const publishedDir = path.join(process.cwd(), 'data', 'repertory', 'published');
    if (!fs.existsSync(publishedDir)) {
      fs.mkdirSync(publishedDir, { recursive: true });
    }
    const manifestsDir = path.join(process.cwd(), 'data', 'repertory', 'manifests');
    if (!fs.existsSync(manifestsDir)) {
      fs.mkdirSync(manifestsDir, { recursive: true });
    }
  }

  static async hasSourceData(sourceId: string): Promise<boolean> {
    await this.ensureDirectoriesExist();
    const filePath = path.join(this.getSourceDir(), `${sourceId}RepertoryData.json`);
    return fs.existsSync(filePath);
  }

  static async readSourceData(sourceId: string): Promise<any[]> {
    await this.ensureDirectoriesExist();
    const filePath = path.join(this.getSourceDir(), `${sourceId}RepertoryData.json`);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Immutable source data file not found: ${filePath}`);
    }
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content);
    } catch (e: any) {
      throw new Error(`Failed to parse source data file ${filePath}: ${e.message}`);
    }
  }

  static getSourceChecksum(sourceId: string): string {
    const filePath = path.join(this.getSourceDir(), `${sourceId}RepertoryData.json`);
    if (!fs.existsSync(filePath)) {
      return '';
    }
    const crypto = require('crypto');
    const fileBuffer = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256');
    hash.update(fileBuffer);
    return hash.digest('hex');
  }
}
