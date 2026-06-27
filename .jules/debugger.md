## 2025-02-21 - Unrestricted Request Body Size

**Bug:** The Express `body-parser` middleware was configured with an unnecessarily high limit (`"50mb"`).
**Root Cause:** This creates a vulnerability to Denial of Service (DoS) attacks, as attackers could send massive payloads (up to 50MB per request) to consume server memory and CPU, potentially crashing the backend.
**Learning:** Always adhere to the principle of least privilege for network configurations. APIs should enforce strict, minimal payload size limits based on expected valid data to prevent resource exhaustion attacks.
