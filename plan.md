1. **Downgrade `jsdom`**
   - The memory states: `Client-side Vitest executions on Node 18.x fail with ERR_REQUIRE_ESM if jsdom version 28+ is used. To maintain GitHub Actions CI compatibility (which runs on Node 18.x) without unilaterally upgrading Node versions, jsdom must be kept at ^22.1.0 in client/package.json.`
   - Edit `client/package.json` to change `jsdom` version to `^22.1.0`.
   - Run `cd client && npm install` to update `package-lock.json` for CI.
2. **Verify tests**
   - Run `cd client && pnpm test -- --run` to ensure tests still pass.
3. **Pre-commit checks**
   - Complete pre-commit steps to make sure proper testing, verifications, reviews and reflections are done.
