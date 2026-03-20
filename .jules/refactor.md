## 2024-05-24 - Extracting secure token generation to utility
**Before:** Controllers contained inline utility functions like `generateClassCode` using `Math.random()`.
**Issue:** `Math.random()` combined with incorrect bounds introduces bias and is not suitable for tokens like class codes. Mixing utilities with business logic violates single responsibility.
**Learning:** Extract random string generation into a dedicated `utils/random.js` file, utilizing Node.js `crypto.randomBytes()`. When mapping bytes to alphanumeric strings, use modulo arithmetic against the array length (`chars[byte % chars.length]`) to avoid probability bias.
