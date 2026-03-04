## 2026-03-04 - Fix continuous interval recreation in Titration Component
**Bug:** The Titration component was continuously recreating the `setInterval` every 100ms when updating the acid levels.
**Root Cause:** The `useEffect` that handled the timer logic had `count` in its dependency array. Since `count` was updated every 100ms within the interval, the `useEffect` fired continuously, clearing and creating a new interval on every tick.
**Learning:** For rapid intervals that update state in React components, do not place the state variable in the `useEffect` dependency array. Instead, use the functional update pattern (e.g. `setCount(prev => prev + 1)`) to avoid triggering re-renders that continuously tear down and rebuild intervals.
