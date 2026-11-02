import fs from 'fs';
import path from 'path';

const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma');

if (!fs.existsSync(schemaPath)) {
  console.log('[prepareVercel] schema.prisma not found, skipping.');
  process.exit(0);
}

const dbUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  '';

let schema = fs.readFileSync(schemaPath, 'utf8');
const isPostgres = dbUrl.startsWith('postgres://') || dbUrl.startsWith('postgresql://');

console.log(`[prepareVercel] Target database provider: ${isPostgres ? 'postgresql' : 'sqlite'}`);

if (isPostgres) {
  schema = schema.replace(/provider\s*=\s*"sqlite"/g, 'provider = "postgresql"');
} else {
  schema = schema.replace(/provider\s*=\s*"postgresql"/g, 'provider = "sqlite"');
}

// Ensure Vercel serverless Linux binaryTargets are present
if (!schema.includes('rhel-openssl')) {
  schema = schema.replace(
    /generator client\s*\{([\s\S]*?)\}/,
    `generator client {\n  provider      = "prisma-client-js"\n  binaryTargets = ["native", "rhel-openssl-1.0.x", "rhel-openssl-3.0.x", "debian-openssl-3.0.x"]\n}`
  );
}

fs.writeFileSync(schemaPath, schema, 'utf8');
console.log('[prepareVercel] Configured prisma/schema.prisma for Vercel deployment.');
