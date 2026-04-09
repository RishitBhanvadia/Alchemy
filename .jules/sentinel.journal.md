## 2024-05-24 - Fix insecure randomness for custom ID generation
**Vulnerability:** The application was using `Math.random()` to generate alphanumeric IDs for meeting and classroom codes, which is not cryptographically secure (CWE-338) and is susceptible to prediction and guessing.
**Learning:** `Math.random` is prone to generating predictable sequences, making it easier for an attacker to guess meeting or class codes, especially since the string space is relatively small.
**Prevention:** Use the built-in `crypto` module (e.g. `crypto.randomInt()`) to ensure generated codes are statistically unpredictable.
