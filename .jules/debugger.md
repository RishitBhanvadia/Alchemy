## YYYY-MM-DD - [Title]
**Bug:** The signup form fails to submit correctly when role card options are used with a screen reader or keyboard.
**Root Cause:** Custom designed `RoleCard` components were rendering standard divs and were not marked with `role="radio"` or grouped in a `role="radiogroup"`. The `jsx-a11y/aria-role` error happens when developers try adding basic roles without keyboard handlers.
**Learning:** For custom role selector cards that act like radio buttons, they must have `role="radiogroup"` on the container and `role="radio"`, `aria-checked`, `tabIndex={0}`, and `onKeyDown` handlers on the items for full keyboard and screen reader accessibility.
