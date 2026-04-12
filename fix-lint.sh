#!/bin/bash
npx eslint@8 client/src/pages/Lab3D.jsx --fix || true
npx eslint@8 client/src/pages/AuthPage.jsx --fix || true
npx eslint@8 client/src/components/auth/SignUpForm.jsx --fix || true
npx eslint@8 client/src/components/auth/RoleCard.jsx --fix || true
npx eslint@8 client/src/components/auth/LoginForm.jsx --fix || true
npx eslint@8 client/src/components/auth/CTAButton.jsx --fix || true
