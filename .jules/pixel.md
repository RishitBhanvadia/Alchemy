**Problem:** Interactive form elements and range inputs lacked proper keyboard focus indicators, making the application inaccessible for keyboard users.
**Context:** Key interactive elements like the chemical sliders in the 3D lab view and auth forms must be easily navigable via keyboard for accessibility compliance.
**Solution:** Added `:focus` and `:focus-visible` styles with a distinct outline utilizing the component's existing color variables (e.g. `--chem-thumb-color`) to maintain consistent design while vastly improving accessibility.
