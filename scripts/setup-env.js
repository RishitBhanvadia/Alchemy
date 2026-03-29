const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m"
};

const setupEnv = () => {
  // 1. Locate .env.local
  let envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    envPath = path.join(process.cwd(), 'client', '.env.local');
  }

  if (!fs.existsSync(envPath)) {
    console.error(`${COLORS.red}❌ Error: .env.local not found in root or client/ folder.${COLORS.reset}`);
    process.exit(1);
  }

  console.log(`${COLORS.cyan}🚀 Starting environment sync from: ${envPath}${COLORS.reset}`);

  // 2. Check dependencies
  let ghInstalled = true;
  try {
    execSync('gh --version', { stdio: 'ignore' });
  } catch (e) {
    ghInstalled = false;
    console.warn(`${COLORS.yellow}⚠️  GitHub CLI (gh) not found. Skipping GitHub sync.${COLORS.reset}`);
  }

  // 3. Parse local variables
  const envContent = fs.readFileSync(envPath, 'utf8');
  const vars = envContent.split(/\r?[\n\r]/)
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => {
      const firstEq = line.indexOf('=');
      const key = line.substring(0, firstEq).trim();
      let value = line.substring(firstEq + 1).trim();
      // Remove surrounding quotes
      value = value.replace(/^["'](.*)["']$/, '$1');
      return { key, value };
    });

  if (vars.length === 0) {
    console.log(`${COLORS.yellow}⚠️  No variables found to sync.${COLORS.reset}`);
    return;
  }

  // 4. Sync each variable
  vars.forEach(({ key, value }) => {
    if (!key) return;

    // GitHub Sync
    if (ghInstalled) {
      try {
        // Check if exists
        const exists = execSync('gh secret list', { encoding: 'utf8' }).includes(key);
        if (exists) {
          console.log(`${COLORS.yellow}⚠️  GitHub Secret '${key}' already exists. Skipping...${COLORS.reset}`);
        } else {
          // Add secret (using stdin correctly for Windows compatibility)
          const cmd = `printf "${value}" | gh secret set "${key}"`;
          // On Windows, use a temp file to avoid shell escape hell
          const tempFile = `.tmp_${key}`;
          fs.writeFileSync(tempFile, value);
          execSync(`gh secret set "${key}" < "${tempFile}"`, { stdio: 'inherit' });
          fs.unlinkSync(tempFile);
          console.log(`${COLORS.green}✅ Success: Added '${key}' to GitHub Secrets.${COLORS.reset}`);
        }
      } catch (e) {
        console.error(`${COLORS.red}❌ Failed: Could not add '${key}' to GitHub.${COLORS.reset}`, e.message);
      }
    }

    // Vercel Sync
    try {
      const exists = execSync('npx vercel env ls', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).includes(key);
      if (exists) {
        console.log(`${COLORS.yellow}⚠️  Vercel Env '${key}' already exists. Skipping...${COLORS.reset}`);
      } else {
        ['production', 'preview', 'development'].forEach(envType => {
            const tempFile = `.tmp_vc_${key}`;
            fs.writeFileSync(tempFile, value);
            execSync(`npx vercel env add "${key}" ${envType} < "${tempFile}"`, { stdio: 'inherit' });
            fs.unlinkSync(tempFile);
        });
        console.log(`${COLORS.green}✅ Success: Added '${key}' to Vercel.${COLORS.reset}`);
      }
    } catch (e) {
      console.warn(`${COLORS.yellow}⚠️  Warning: Vercel sync failed for ${key}. Run 'npx vercel login'.${COLORS.reset}`);
    }
  });

  console.log(`${COLORS.cyan}🏁 Environment sync complete!${COLORS.reset}`);
};

setupEnv();
