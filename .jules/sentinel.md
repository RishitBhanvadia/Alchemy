## 2025-02-21 - Unrestricted Request Body Size

**Vulnerability:** The Express `body-parser` middleware was configured with an unnecessarily high limit (`"50mb"`). This creates a vulnerability to Denial of Service (DoS) attacks, as attackers could send massive payloads (up to 50MB per request) to consume server memory and CPU, potentially crashing the backend.
**Learning:** Always adhere to the principle of least privilege for network configurations. APIs should enforce strict, minimal payload size limits based on expected valid data to prevent resource exhaustion attacks.
**Prevention:** Lowered the `body-parser` limits for both `urlencoded` and `json` parsers to `"2mb"`, effectively mitigating large payload DoS risks while still accommodating normal application traffic.
