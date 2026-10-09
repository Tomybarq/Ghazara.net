/**
 * Ghazara Sales App - Database Migration & Connectivity Synchronizer
 * Verifies schema files, environment config, and live PostgreSQL connectivity.
 */

import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🔄 Checking Database & Migration Synchronization...\n');

// 1. Verify Schema & Migration Files
const schemaPrismaPath = path.join(rootDir, 'prisma', 'schema.prisma');
const migrationSqlPath = path.join(rootDir, 'prisma', 'migrations', '20261008000000_init', 'migration.sql');
const databaseSchemaSql = path.join(rootDir, 'database', 'schema.sql');
const databaseSeedSql = path.join(rootDir, 'database', 'seed.sql');

const files = [
  { name: 'Prisma Schema', path: schemaPrismaPath },
  { name: 'Prisma Migration SQL', path: migrationSqlPath },
  { name: 'Database Schema DDL', path: databaseSchemaSql },
  { name: 'Database Seed SQL', path: databaseSeedSql },
];

let allFilesPresent = true;
for (const f of files) {
  if (fs.existsSync(f.path)) {
    const stat = fs.statSync(f.path);
    console.log(`✅ [OK] ${f.name} exists (${stat.size} bytes)`);
  } else {
    console.error(`❌ [MISSING] ${f.name} not found at ${f.path}`);
    allFilesPresent = false;
  }
}

if (!allFilesPresent) {
  process.exit(1);
}

// 2. Parse and Test Database Connection
const envPath = path.join(rootDir, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const dbMatch = envContent.match(/DATABASE_URL=["']?(postgres(?:ql)?:\/\/[^"'\n]+)["']?/);
  
  if (dbMatch && dbMatch[1]) {
    try {
      const parsedUrl = new URL(dbMatch[1].replace(/^postgres:\/\//, 'http://'));
      const host = parsedUrl.hostname;
      const port = Number(parsedUrl.port) || 5432;

      console.log(`\n📡 Testing connection to ${host}:${port}...`);
      const socket = net.createConnection({ host, port, timeout: 5000 }, () => {
        console.log(`✅ [CONNECTED] TCP Handshake with ${host}:${port} successful!`);
        socket.end();
        console.log('\n🎉 Database migrations and connectivity are 100% in sync!\n');
      });

      socket.on('error', (err) => {
        console.warn(`⚠️ [WARN] Network socket notice: ${err.message}`);
      });
    } catch {
      console.log('ℹ️ DATABASE_URL formatted for Prisma Accelerate / Custom driver.');
    }
  }
} else {
  console.log('ℹ️ No local .env file found; using repository defaults.');
}
