# Phase 3: Advanced Interactivity, 3D Immersion & Instructor Tools

## 🔬 Phase 3.1: 3D Immersion & Physics Refinement (Three.js Engine)
*Objective: Transition from UI-driven interactions (clicking buttons) to physics-driven 3D interactions (grabbing and pouring).*

**3.1.1: Drag-and-Drop 3D Mechanics**
*   **Libraries:** Integration of `@react-three/drei` (specifically `DragControls` or `useGesture`) and `@react-three/rapier` for rigid body physics.
*   **Implementation:**
    *   Refactor the main `Laboratory.jsx` scene to wrap interactive mesh objects (beakers, test tubes, flasks) in Rapier `<RigidBody>` tags.
    *   Map Raycaster events so the user can click, hold, and drag a beaker in 3D space.
    *   Implement rotation constraints so a beaker can only be tilted when it hovers over a target container.

**3.1.2: Advanced WebGL Fluid Dynamics (Shader Magic)**
*   **Implementation:** 
    *   Replace static SVG/HTML heights for liquid with dynamic Three.js ShaderMaterials. 
    *   Write a custom GLSL fragment shader that smoothly interpolates between two color values (e.g., clear HCl to pink when Phenolphthalein drops hit).
    *   Map the tilt angle of the dragged beaker to a "pouring" animation, rendering a translucent cylinder (virtual liquid stream) intersecting the target beaker.

**3.1.3: Dynamic Particle Systems (Gases & Explosions)**
*   **Implementation:**
    *   Create a reusable `<ParticleEmitter>` component in React Three Fiber.
    *   Tie reaction metadata to the emitter. E.g., if `gas === "H2"`, emit fast-moving, white/translucent `THREE.Points` with upward velocity. If reaction is exothermic/explosive, apply a radial velocity burst.
    *   Use GSAP or Framer Motion for the UI screens shaking during a "boom" event, syncing 2D DOM with 3D WebGL events.

## 👨‍🏫 Phase 3.2: Educator & Classroom Architecture (Supabase & RBAC)
*Objective: Allow schools/teachers to use Alchemistry to monitor students and assign specific lab tasks.*

**3.2.1: Supabase Role-Based Access Control (RBAC)**
*   **Database Schema Updates:**
    *   Modify `users` table or auth metadata to include `role` (`student`, `teacher`, `admin`).
    *   Create a `classrooms` table (`id`, `teacher_id`, `class_name`, `join_code`).
    *   Create a `classroom_students` linking table (`classroom_id`, `student_id`).
*   **Security:** Write strict Supabase RLS (Row Level Security) policies so teachers can only see data for students registered with their specific `join_code`.

**3.2.2: The Teacher Dashboard**
*   **Frontend UI:** Create a React portal exclusively for users with the `teacher` role.
*   **Features:**
    *   **Data Grid:** A responsive table (using ag-Grid or similar) listing all students, their total XP, badges, and completion rates.
    *   **Analytics:** Chart.js/Recharts integration showing a bell curve of class scores on specific experiments (e.g., "Class Average for Titration: 85%").

**3.2.3: Custom Lab Assignments Engine**
*   **Database Schema:** Create an `assignments` table (`id`, `classroom_id`, `experiment_type`, `required_score`, `due_date`) and a `student_assignments` tracking table.
*   **Frontend UI:** 
    *   Add an "Assignments" tab to the student's existing Profile/Dashboard.
    *   Lock certain UI routes (like Sandbox) until assignments are completed to gamify the learning path.

## 🌡️ Phase 3.4: Algorithmic Sandbox & Reaction Engine Refactor
*Objective: Move away from "hardcoded" combinations towards a rules-based engine.*

**3.3.1: Algorithmic Chemistry Engine (True Sandbox)**
*   **Implementation:** Currently, the app relies on specific chemical matches (e.g., if A + B). We will refactor this to a rules-based engine.
*   **Data Structure:** Implement a chemical property matrix (JSON mapping reactivity series, valency, state at room temp).
*   **Logic:** When the user mixes *any* two chemicals from the shelf, the backend computes the reaction dynamically based on replacement rules (Single Replacement, Double Replacement, Combustion) rather than specific hardcoded endpoints.

## 🚀 Phase 3.5: Performance Polish & Mobile Responsiveness
*Objective: Guarantee the app runs smoothly on 100% of target devices, including school tablets.*

**3.4.1: Asset Optimization & LOD (Level of Detail)**
*   **Implementation:**
    *   Optimize static assets.
    *   Implement dynamic resolution scaling if 3D features are struggling.

**3.4.2: UI Responsiveness**
*   **Implementation:**
    *   Refactor absolute/pixel-based positioning (e.g., `transform: 'translate(928px, 118px)'`) to CSS Grid, Flexbox, or Viewport (`vw`, `vh`) units.
    *   Implement specific multi-touch event listeners (`onTouchStart`, `onTouchMove`) so drag-and-drop pouring works natively on iPads.
