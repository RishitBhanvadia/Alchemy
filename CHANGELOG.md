# Changelog

All notable changes to Alchemistry Phase 3 will be documented in this file.

## [Iteration 1] — Install all new Phase 3 dependencies — package.json, package-lock.json
- Installed zustand, @tanstack/react-table, recharts in client
- Installed gltf-pipeline in root devDependencies
- Verified existing deps: @react-three/rapier, @react-three/drei, @react-three/fiber, gsap, framer-motion

## [Iteration 2] — Scaffold all new files from File Map — Multiple files
- Created component stubs: Beaker.jsx, Flask.jsx, ParticleEmitter.jsx, StudentAnalyticsChart.jsx
- Created page stub: TeacherDashboard.jsx
- Created shader stub: shaders/LiquidShader.js
- Created hook stubs: hooks/useLabPhysics.js, hooks/useTemperature.js, hooks/usePerformanceScaling.js
- Created store: store/labStore.js (Zustand)
- Created server stubs: routes/reactions.js, data/chemicalMatrix.json
- Created supabase stubs: migrations/003_rbac_classrooms.sql, migrations/004_assignments.sql, policies/rls_policies.sql
- Created scripts stub: scripts/compress-assets.sh

## [Iteration 3] — Create Zustand labStore with all required slices — store/labStore.js
- Implemented full Zustand store with slices: temperature, deltaH, postProcessingEnabled, shadowsEnabled, role, currentAssignments, activeChemicals, lastReactionResult
- Added derived state helpers: getThermalState(), hasOverdueAssignments(), applyReactionHeat()
- Added performance mode helpers: enterLowPerformanceMode(), exitLowPerformanceMode()
- Added resetLab() action for starting fresh experiments
- Fixed pre-existing test setup issue: installed missing @testing-library/dom peer dependency
- Created 31 unit tests covering all slices (store/__tests__/labStore.test.js) — all passing

## [Iteration 4] — Write Supabase migration 003_rbac_classrooms.sql — supabase/
- Created profiles table with role column (student/teacher/admin) instead of altering auth.users (Supabase best practice)
- Created classrooms table with teacher_id, class_name, join_code
- Created classroom_students junction table with composite primary key
- Implemented RLS policies: teacher CRUD on own classrooms, teacher SELECT on own classroom students, student self-join/leave, student read-only classrooms
- Created auto-profile-creation trigger on auth.users INSERT
- Added performance indexes on foreign keys and join_code
- Updated rls_policies.sql as reference documentation
- Created seed.sql with demo teacher, 2 students, 1 classroom, enrollments

## [Iteration 5] — Write Supabase migration 004_assignments.sql and seed data — supabase/
- Created assignments table (classroom_id, experiment_type, title, required_score, due_date)
- Created student_assignments junction table (assignment_id, student_id, score, completed_at)
- Implemented RLS: teacher manage assignments in own classrooms, student view/submit own progress
- Created student_assignment_status view with computed status (Pending/Completed/Overdue)
- Added performance indexes
- Updated seed.sql with 2 demo assignments and student progress data

## [Iteration 6] — Wrap Beaker.jsx in RigidBody with CCD — components/Beaker.jsx
- Full implementation with @react-three/rapier RigidBody wrapping
- CCD enabled (prevents tunneling through lab bench)
- Rotation constraint: enabledRotations={[true, false, false]} (X-axis tilt only)
- MeshTransmissionMaterial glass with realistic transparency
- LiquidShader integration with animated wave effect via useFrame
- Configurable type (dynamic/fixed/kinematicPosition), radius, height
- Optional enablePhysics prop for non-physics use cases
- Collision callback support via onCollisionEnter prop

## [Iteration 7] — Wrap Flask.jsx in RigidBody with CCD — components/Flask.jsx
- Full Erlenmeyer flask implementation: wide bottom + narrow neck geometry
- RigidBody with CCD, rotation constraints, CuboidCollider
- MeshTransmissionMaterial glass for body and neck sections
- LiquidShader integration with tapered liquid fill
- TestTube.jsx skipped: existing testtube.jsx is SVG/2D, not a 3D component (PRD says "if exists")

## [Iteration 8] — Implement useLabPhysics.js hook — hooks/useLabPhysics.js
- Drag state machine: idle → hovering → dragging → released → idle
- Raycaster hit detection on invisible XY drag plane
- Drag offset calculation (object doesn't snap to cursor)
- Tilt constraint: configurable radius from target position
- Pour detection: near target X + above threshold Y + canTilt
- Velocity tracking for liquid slosh effects
- Bundled eventHandlers object for easy mesh attachment
- updateFrame() helper for smooth position/rotation interpolation in useFrame

## [Iteration 9] — Implement LiquidShader.js with advanced GLSL — shaders/LiquidShader.js
- createLiquidMaterial(colorA, colorB, fillLevel) factory with all PRD-required uniforms
- Multi-frequency vertex wave displacement with slosh/tilt support
- Fragment: smooth fill boundary, depth gradient, subsurface scattering, Fresnel highlights, caustic shimmer
- animateColorTransition() for smooth 1.2s reaction color transitions (linear interpolation per PRD)
- uMixRatio uniform for blending between colorA and colorB during reactions

## [Iteration 10] — Implement ParticleEmitter.jsx — components/ParticleEmitter.jsx
- BufferGeometry-based particles: H2 (200 white upward), CO2 (150 grey outward)
- Exothermic radial burst with orange/red color gradient
- 2-second lifetime with fade-out via size/color attenuation
- GSAP camera shake: ±5px for 400ms on exothermic fire
- Custom event dispatch for Framer Motion HUD pulse
- Per-frame position/velocity/color/size updates via useFrame
- Additive blending for glowing particle effect

## [Iteration 11] — Teacher Dashboard + StudentAnalyticsChart — pages/TeacherDashboard.jsx, components/StudentAnalyticsChart.jsx
- Route guard: redirects to / if role !== 'teacher' (via labStore)
- Supabase query for classroom students via classrooms → classroom_students → profiles
- @tanstack/react-table data grid with columns: Name, XP, Badges, Experiments, Last Active
- Client-side sorting (click headers) and global search filter
- StudentAnalyticsChart: Recharts BarChart with 10% score buckets, gradient colors, stat badges
- Experiment selector dropdown for score visualization
- Responsive: card list view on screens < 768px
- Added /dashboard/teacher route to App.jsx
