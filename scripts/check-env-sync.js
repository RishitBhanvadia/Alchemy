const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// ANSI Color Codes
const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m"
};

const checkSync = () => {
  // 1. Locate .env.local
  let envPath = path.join(process.cwd(), '.env.local');
  if (process.env.CI) {
    console.log(`${COLORS.yellow}⚠️  Skipping sync check in CI environment as .env.local is not available.${COLORS.reset}`);
    return;
  }
  if (!fs.existsSync(envPath)) {
    envPath = path.join(process.cwd(), 'client', '.env.local');
  }

  if (process.env.CI) {
    console.log(`${COLORS.yellow}⚠️  Skipping sync check in CI environment as .env.local is not available.${COLORS.reset}`);
    return;
  }
  if (!fs.existsSync(envPath)) {
    console.error(`${COLORS.red}❌ Error: .env.local not found in root or client/ folder.${COLORS.reset}`);
    process.exit(1);
  }

  // 2. Read local variables
  const envContent = fs.readFileSync(envPath, 'utf8');
  const localVars = envContent.split(/\r?\n/)
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => line.split('=')[0].trim());

  if (localVars.length === 0) {
    console.log(`${COLORS.yellow}⚠️  No variables found in ${envPath}${COLORS.reset}`);
    return;
  }

  console.log(`${COLORS.cyan}${COLORS.bold}🔍 Checking sync for ${localVars.length} variables...${COLORS.reset}\n`);

  // 3. Fetch remote state
  let vercelEnvs = "";
  try {
    // Use npx for vercel to avoid requiring global installation
    vercelEnvs = execSync('npx vercel env ls', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    console.warn(`${COLORS.yellow}⚠️  Warning: Failed to fetch Vercel envs. run 'npx vercel login' first.${COLORS.reset}`);
  }

  let ghSecrets = "";
  let ghInstalled = true;
  try {
    // Check if gh is installed first
    execSync('gh --version', { stdio: 'ignore' });
    ghSecrets = execSync('gh secret list', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (e) {
    ghInstalled = false;
    console.warn(`${COLORS.yellow}⚠️  Warning: GitHub CLI (gh) not found or not logged in. skipping GitHub check.${COLORS.reset}`);
    console.warn(`${COLORS.cyan}💡 Install from: https://cli.github.com/${COLORS.reset}`);
  }

  // 4. Compare and Build Table
  const results = [];
  let allSynced = true;

  // Header
  console.log(`${COLORS.bold}${'Variable'.padEnd(40)} | ${'Local'.padEnd(8)} | ${'Vercel'.padEnd(8)} | ${'GitHub'.padEnd(8)}${COLORS.reset}`);
  console.log('-'.repeat(75));

  localVars.forEach(v => {
    const inVercel = vercelEnvs.includes(v);
    const inGitHub = ghInstalled ? ghSecrets.includes(v) : false;
    
    // Only fail the sync check if Vercel is missing OR (GitHub is installed and secret is missing)
    if (!inVercel || (ghInstalled && !inGitHub)) allSynced = false;

    const localStatus = `${COLORS.green}READY${COLORS.reset}`;
    const vercelStatus = inVercel ? `${COLORS.green}OK${COLORS.reset}` : `${COLORS.red}MISSING${COLORS.reset}`;
    const githubStatus = !ghInstalled 
      ? `${COLORS.yellow}SKIP${COLORS.reset}` 
      : (inGitHub ? `${COLORS.green}OK${COLORS.reset}` : `${COLORS.red}MISSING${COLORS.reset}`);

    console.log(`${v.padEnd(40)} | ${localStatus.padEnd(16)} | ${vercelStatus.padEnd(16)} | ${githubStatus.padEnd(16)}`);
  });

  // 5. Final Report
  if (!allSynced) {
    console.log(`\n${COLORS.red}${COLORS.bold}❌ Sync check failed!${COLORS.reset} Some variables are missing.`);
    console.log(`${COLORS.yellow}💡 Run 'npm run env:push' to sync. (Note: Requires npx vercel login and gh auth login)${COLORS.reset}`);
    process.exit(1);
  } else {
    let msg = `\n${COLORS.green}${COLORS.bold}✅ Success!${COLORS.reset} Local variables are in sync.`;
    if (!ghInstalled) msg += ` ${COLORS.yellow}(GitHub check was skipped)${COLORS.reset}`;
    console.log(msg);
  }
};

checkSync();
