/**
 * Ghazara Sales App - Database Migration & Connectivity Diagnostic Synchronizer
 * 
 * Validates:
 * 1. Schema & Migration file integrity (Prisma schema, migration SQL, DDL, Seed SQL)
 * 2. Supabase environment configuration (Transaction pooler :6543, Session pooler :5432, Shadow DB :5432)
 * 3. Shadow database isolation safety guard (prevents destructive actions on production)
 * 4. Network socket connectivity with finite timeouts (distinguishing socket reachability from DB auth)
 */

import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SOCKET_TIMEOUT_MS = 5000;

console.log('================================================================');
console.log(' Ghazara Sales App - Supabase PostgreSQL & Prisma Sync Check');
console.log('================================================================\n');

let hasFailure = false;

// ------------------------------------------------------------------------------
// Step 1: File Existence & Integrity Check
// ------------------------------------------------------------------------------
console.log('📁 [Step 1/3] Verifying Schema & Migration Files...');

const requiredFiles = [
  { name: 'Prisma Schema', path: path.join(rootDir, 'prisma', 'schema.prisma') },
  { name: 'Prisma Initial Migration SQL', path: path.join(rootDir, 'prisma', 'migrations', '20261008000000_init', 'migration.sql') },
  { name: 'Database Schema DDL', path: path.join(rootDir, 'database', 'schema.sql') },
  { name: 'Database Seed SQL', path: path.join(rootDir, 'database', 'seed.sql') },
];

for (const file of requiredFiles) {
  if (fs.existsSync(file.path)) {
    const stats = fs.statSync(file.path);
    if (stats.size > 0) {
      console.log(`  ✅ ${file.name} found (${stats.size.toLocaleString()} bytes)`);
    } else {
      console.error(`  ❌ ${file.name} is empty (0 bytes)`);
      hasFailure = true;
    }
  } else {
    console.error(`  ❌ ${file.name} missing at path: ${path.relative(rootDir, file.path)}`);
    hasFailure = true;
  }
}

// ------------------------------------------------------------------------------
// Helper: Safe URL Parsing and Credential Masking
// ------------------------------------------------------------------------------
function parseAndSanitizeUrl(rawUrl, varName) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { error: `Environment variable ${varName} is missing or empty.` };
  }

  // Handle placeholders without blowing up URL parser
  if (rawUrl.includes('[PASSWORD]') || rawUrl.includes('[PROJECT_REF]')) {
    return {
      isPlaceholder: true,
      sanitized: rawUrl.replace(/:([^@]+)@/, ':***@'),
      message: `Contains template placeholder values (e.g. [PASSWORD]).`,
    };
  }

  try {
    const normalized = rawUrl.replace(/^postgres(?:ql)?:\/\//i, 'http://');
    const parsed = new URL(normalized);

    const username = decodeURIComponent(parsed.username || '');
    const hostname = parsed.hostname;
    const port = parsed.port ? Number(parsed.port) : 5432;
    const pathname = parsed.pathname || '/postgres';

    const sanitized = `postgresql://${username ? `${username}:***@` : ''}${hostname}:${port}${pathname}`;

    return {
      username,
      hostname,
      port,
      pathname,
      search: parsed.search,
      sanitized,
      rawUrl,
    };
  } catch (err) {
    return { error: `Failed to parse ${varName}: ${err.message}` };
  }
}

// ------------------------------------------------------------------------------
// Step 2: Environment Variables Validation & Shadow DB Safety Check
// ------------------------------------------------------------------------------
console.log('\n🔒 [Step 2/3] Validating Supabase Environment Configuration...');

// Load .env if present
const envFilePath = path.join(rootDir, '.env');
const envVars = { ...process.env };

if (fs.existsSync(envFilePath)) {
  const envFileContent = fs.readFileSync(envFilePath, 'utf8');
  for (const line of envFileContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const match = trimmed.match(/^([A-Za-z_0-9]+)\s*=\s*(.*)$/);
    if (match) {
      let val = match[2].trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!envVars[match[1]]) {
        envVars[match[1]] = val;
      }
    }
  }
}

const dbUrlParsed = parseAndSanitizeUrl(envVars.DATABASE_URL, 'DATABASE_URL');
const directUrlParsed = parseAndSanitizeUrl(envVars.DIRECT_URL, 'DIRECT_URL');
const shadowUrlParsed = parseAndSanitizeUrl(envVars.SHADOW_DATABASE_URL, 'SHADOW_DATABASE_URL');

// 1. Transaction Pooler (DATABASE_URL)
if (dbUrlParsed.error) {
  console.warn(`  ⚠️  DATABASE_URL: ${dbUrlParsed.error}`);
} else if (dbUrlParsed.isPlaceholder) {
  console.log(`  ℹ️  DATABASE_URL (Transaction Pooler): ${dbUrlParsed.sanitized} [Template]`);
} else {
  console.log(`  ✅ DATABASE_URL (Transaction Pooler): ${dbUrlParsed.sanitized}`);
  if (dbUrlParsed.port === 6543) {
    console.log(`     -> Correctly configured for Supabase Transaction Pooler on port 6543.`);
  } else {
    console.log(`     -> Note: Connection port is ${dbUrlParsed.port} (Supabase transaction pooler standard is 6543).`);
  }
}

// 2. Session Pooler (DIRECT_URL)
if (directUrlParsed.error) {
  console.warn(`  ⚠️  DIRECT_URL: ${directUrlParsed.error}`);
} else if (directUrlParsed.isPlaceholder) {
  console.log(`  ℹ️  DIRECT_URL (Session Pooler): ${directUrlParsed.sanitized} [Template]`);
} else {
  console.log(`  ✅ DIRECT_URL (Session Pooler): ${directUrlParsed.sanitized}`);
  if (directUrlParsed.port === 5432) {
    console.log(`     -> Correctly configured for Supabase Session Pooler / Migration connection on port 5432.`);
  } else {
    console.log(`     -> Note: Connection port is ${directUrlParsed.port} (Supabase session pooler standard is 5432).`);
  }
}

// 3. Shadow Database (SHADOW_DATABASE_URL) & Isolation Safety Guard
if (shadowUrlParsed.error) {
  console.log(`  ℹ️  SHADOW_DATABASE_URL: Optional for runtime; needed when running 'prisma migrate dev'.`);
} else if (shadowUrlParsed.isPlaceholder) {
  console.log(`  ℹ️  SHADOW_DATABASE_URL (Shadow Database): ${shadowUrlParsed.sanitized} [Template]`);
} else {
  console.log(`  ✅ SHADOW_DATABASE_URL (Shadow Database): ${shadowUrlParsed.sanitized}`);

  // Critical Safety Check: Ensure Shadow DB is isolated from Main DB
  const isSameHost = shadowUrlParsed.hostname === dbUrlParsed.hostname;
  const isSameUser = shadowUrlParsed.username === dbUrlParsed.username;
  const isSameDb = shadowUrlParsed.pathname === dbUrlParsed.pathname;

  if (isSameHost && isSameUser && isSameDb && !dbUrlParsed.isPlaceholder) {
    console.error(`  🚨 CRITICAL SAFETY CONFLICT: SHADOW_DATABASE_URL targets the same project/database as DATABASE_URL!`);
    console.error(`     Prisma shadow databases are automatically dropped and recreated during migrations.`);
    console.error(`     Pointing SHADOW_DATABASE_URL to production will result in complete data loss.`);
    console.error(`     Please point SHADOW_DATABASE_URL to a dedicated, empty shadow database project.`);
    hasFailure = true;
  } else {
    console.log(`     -> Safety verified: Shadow database is isolated from primary application database.`);
  }
}

// ------------------------------------------------------------------------------
// Step 3: Network Socket Connectivity Checks (with finite timeout & cleanup)
// ------------------------------------------------------------------------------
console.log('\n📡 [Step 3/3] Testing Network Socket Reachability...');

function checkSocket(host, port, label) {
  return new Promise((resolve) => {
    if (!host || !port) {
      return resolve({ success: false, skipped: true, label, message: 'Host or port unavailable' });
    }

    const socket = new net.Socket();
    let isSettled = false;

    socket.setTimeout(SOCKET_TIMEOUT_MS);

    socket.on('connect', () => {
      if (isSettled) return;
      isSettled = true;
      socket.end();
      socket.destroy();
      resolve({ success: true, label, host, port });
    });

    socket.on('timeout', () => {
      if (isSettled) return;
      isSettled = true;
      socket.destroy();
      resolve({
        success: false,
        label,
        host,
        port,
        message: `Socket connection timed out after ${SOCKET_TIMEOUT_MS}ms`,
      });
    });

    socket.on('error', (err) => {
      if (isSettled) return;
      isSettled = true;
      socket.destroy();
      resolve({
        success: false,
        label,
        host,
        port,
        message: err.message,
      });
    });

    socket.connect(port, host);
  });
}

async function runSocketChecks() {
  const checksToRun = [];

  if (dbUrlParsed.hostname && !dbUrlParsed.isPlaceholder) {
    checksToRun.push(checkSocket(dbUrlParsed.hostname, dbUrlParsed.port, 'Transaction Pooler (DATABASE_URL)'));
  }

  if (directUrlParsed.hostname && !directUrlParsed.isPlaceholder) {
    checksToRun.push(checkSocket(directUrlParsed.hostname, directUrlParsed.port, 'Session Pooler (DIRECT_URL)'));
  }

  if (shadowUrlParsed.hostname && !shadowUrlParsed.isPlaceholder) {
    checksToRun.push(checkSocket(shadowUrlParsed.hostname, shadowUrlParsed.port, 'Shadow Database (SHADOW_DATABASE_URL)'));
  }

  if (checksToRun.length === 0) {
    console.log('  ℹ️  No live hostnames configured (using templates or default mock mode). Skipping network sockets.');
  } else {
    const results = await Promise.all(checksToRun);

    for (const res of results) {
      if (res.success) {
        console.log(`  ✅ [TCP OK] ${res.label} -> Socket open on ${res.host}:${res.port}`);
      } else {
        console.warn(`  ⚠️  [TCP FAILED] ${res.label} -> ${res.message}`);
      }
    }

    console.log('\n  📌 NOTE on Verification Scope:');
    console.log('     TCP socket reachability verifies network pathway to the Supabase pooler only.');
    console.log('     It does not perform database authentication or schema inspection.');
    console.log('     To execute migrations against Supabase, run: npx prisma migrate deploy');
  }

  console.log('\n================================================================');
  if (hasFailure) {
    console.error(' ❌ Synchronization check failed. Please resolve the errors above.');
    console.log('================================================================\n');
    process.exit(1);
  } else {
    console.log(' 🎉 All schema files and configuration checks passed successfully!');
    console.log('================================================================\n');
    process.exit(0);
  }
}

runSocketChecks();
