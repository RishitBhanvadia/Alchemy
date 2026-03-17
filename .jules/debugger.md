## 2024-05-18 - Syntax Error in CSS Build
**Bug:** Build command fails or throws warnings due to a CSS syntax error `Expected identifier but found whitespace [css-syntax-error]` and `Unexpected "3px" [css-syntax-error]`.
**Root Cause:** Invalid CSS in `client/src/pages/titration.css` starting around line 192 due to orphaned CSS properties (`border-left`, `font-size`, `color`) without a selector. They were outside the previous `.op-btn:disabled` block.
**Learning:** Always check CSS build logs for parse warnings and ensure CSS properties belong to a selector.
