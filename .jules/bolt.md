## 2025-04-06 - Initial Setup
**Learning:** Initial journal creation for Bolt agent.
**Action:** Use this file to log CRITICAL learnings only.
## 2025-04-06 - R3F State Throttling
**Learning:** Using React state setters (like \`onPour\`) directly inside \`useFrame\` triggers 60fps React renders for the parent component, severely impacting performance.
**Action:** Always throttle or debounce state callbacks inside \`useFrame\` using an accumulator to limit React state updates to 10-15fps.
