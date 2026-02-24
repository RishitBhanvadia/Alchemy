## 2026-02-24 - Node 18 CI Compatibility
**Vulnerability:** Build pipeline failure (DoS of development process) due to incompatible dependencies (`jsdom` v28+, `vitest` v4+ vs Node 18).
**Learning:** The CI environment runs Node 18, but `package.json` allowed versions requiring Node 20+. `jsdom` specifically caused `ERR_REQUIRE_ESM` with `html-encoding-sniffer`.
**Prevention:** Pinned `jsdom` to `^25.0.1` and `vitest` to `^2.1.8` in `client/package.json`. Future updates must verify Node 18 compatibility or upgrade the CI environment first.
