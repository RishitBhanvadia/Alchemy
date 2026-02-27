## 2024-05-24 - [Immersive Global Loading State]
**Problem:** The application used a generic, inline `<div>Loading...</div>` text for route transitions, which broke the immersive "scientific lab" atmosphere and felt like a placeholder.
**Context:** For a virtual chemistry lab, maintaining the suspension of disbelief is key. A plain text loader makes it feel like a standard website rather than a simulation environment.
**Solution:** Implemented `GlobalLoader.jsx`, a full-screen, sci-fi themed "atom spinner" animation using the existing neon design system. This transforms wait times into part of the "lab initialization" process, smoothing transitions between lazy-loaded modules.
