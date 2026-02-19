# Component Documentation

## Overview

This document provides detailed information about the React components used in the Alchemistry application.

---

## Core Components

### App.jsx

**Purpose**: Main application component that handles routing and global layout.

**Features**:
- React Router integration
- Conditional Navbar rendering
- Toast notification system
- Cursor follower effect

**Routes**:
- `/` - Landing page
- `/login` - Authentication
- `/dashboard` - Main dashboard
- `/lab` - Laboratory experiments
- `/titration` - Titration module
- `/organic` - Organic chemistry
- `/inorganic` - Inorganic chemistry
- `/history` - Experiment history
- `/result` - Experiment results
- `/success` - Success page

---

## Page Components

### Landing.jsx

**Purpose**: Landing page with 3D animations and call-to-action.

**Features**:
- 3D molecule animations
- Glassmorphism design
- Start button navigation

---

### Login.jsx

**Purpose**: User authentication page.

**Props**: None

**State**:
- `email` (string): User email
- `password` (string): User password

**Features**:
- Supabase authentication
- Holographic tilt effect
- Toast notifications for success/error
- Form validation

**Example**:
```jsx
<Login />
```

---

### Dashboard.jsx

**Purpose**: Main dashboard with module selection.

**Features**:
- Module cards (Laboratory, Titration, Organic, Inorganic, History)
- Glassmorphism card design
- Hover effects
- Navigation to different modules

---

### Lab.jsx

**Purpose**: Main laboratory experiment interface.

**State**:
- Chemical concentrations (A, B, C, D)
- Experiment status
- Result data

**Features**:
- Chemical selection sliders
- 3D reactive beaker
- Real-time result calculation
- GSAP animations

---

### History.jsx

**Purpose**: Display user's experiment history.

**Features**:
- Fetch experiments from Supabase
- Display in table format
- Score badges (color-coded)
- Loading state with logo spinner

---

## 3D Animation Components

### ReactiveBeaker.jsx

**Purpose**: 3D animated beaker that changes based on experiment status.

**Props**:
- `status` ('idle' | 'loading' | 'success' | 'failed'): Current experiment status

**Features**:
- Three.js integration
- Color-changing liquid
- Wave animations
- Glass material with transmission

**Example**:
```jsx
<ReactiveBeaker status="success" />
```

---

### FloatingMolecule.jsx

**Purpose**: Animated 3D molecule for landing page.

**Features**:
- Orbital rotation
- Particle effects
- Interactive hover

---

### HolographicLogin.jsx

**Purpose**: 3D tilt effect wrapper for login form.

**Props**:
- `children` (ReactNode): Content to wrap

**Features**:
- React Parallax Tilt
- Glassmorphism effect
- Perspective transforms

**Example**:
```jsx
<HolographicLogin>
    <LoginForm />
</HolographicLogin>
```

---

### CanvasContainer.jsx

**Purpose**: Three.js canvas wrapper with React Three Fiber.

**Props**:
- `children` (ReactNode): 3D components to render

**Features**:
- Camera setup
- Lighting configuration
- OrbitControls

---

## UI Components

### Navbar.jsx

**Purpose**: Navigation bar for authenticated pages.

**Features**:
- Links to Dashboard, History, Logout
- Glassmorphism design
- Responsive layout

---

### CursorFollower.jsx

**Purpose**: Custom cursor effect that follows mouse movement.

**Features**:
- Smooth animations
- Glow effect
- Follows cursor with delay

---

### CustomTestTube.jsx

**Purpose**: SVG test tube component for displaying results.

**Props**:
- `color` (string): Fill color
- `str` (string): SVG path data

**Example**:
```jsx
<CustomTestTube color="#00ff88" str="M 218.985..." />
```

---

### TitrationSetup.jsx

**Purpose**: SVG visualization of titration apparatus.

**Props**:
- `acidHeight` (string): SVG path for liquid level
- `color` (string): Liquid color
- `shaky` (boolean): Apply shake animation
- `count` (number): Titration count

**Example**:
```jsx
<TitrationSetup 
    acidHeight="M 291.86..."
    color="#ff0055" 
    shaky={true} 
    count={50} 
/>
```

---

## Utility Functions

### logger.js

**Purpose**: Environment-aware logging utility.

**Methods**:
- `logger.debug(message, ...args)` - Debug logs (dev only)
- `logger.info(message, ...args)` - Info logs
- `logger.warn(message, ...args)` - Warning logs
- `logger.error(message, ...args)` - Error logs

**Example**:
```javascript
import logger from '../utils/logger';

logger.info('User logged in', { userId: 123 });
logger.error('Login failed', { error: err.message });
```

---

### notifications.js

**Purpose**: Toast notification system.

**Methods**:
- `showSuccess(message)` - Green success toast
- `showError(message)` - Red error toast
- `showInfo(message)` - Blue info toast
- `showLoading(message)` - Loading toast (returns ID)
- `dismissToast(toastId)` - Dismiss specific toast

**Example**:
```javascript
import { showSuccess, showError } from '../utils/notifications';

showSuccess('Experiment completed!');
showError('Failed to load data');
```

---

### supabaseClient.js

**Purpose**: Supabase client configuration.

**Exports**:
- `supabase` - Configured Supabase client

**Environment Variables**:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anon key

---

## Styling Conventions

### CSS Modules
Each component has its own CSS file (e.g., `login.css`, `dashboard.css`).

### Design System
- **Colors**: Glassmorphism with neon accents (#00ff88, #ff0055, #00aaff)
- **Fonts**: 
  - Fredericka the Great (headings)
  - Ubuntu (body)
  - Josefin Sans (special text)
- **Effects**: 
  - Glassmorphism (`backdrop-filter: blur()`)
  - Neon glow (`text-shadow`, `box-shadow`)
  - Smooth transitions

---

## Best Practices

1. **Props Validation**: Use PropTypes or TypeScript for type safety
2. **Error Boundaries**: Wrap components in error boundaries
3. **Loading States**: Always show loading indicators
4. **Accessibility**: Add ARIA labels and keyboard navigation
5. **Performance**: Use React.memo() for expensive components
6. **Code Splitting**: Lazy load pages with React.lazy()

---

## Common Patterns

### Fetching Data from Supabase

```javascript
const fetchData = async () => {
    try {
        const { data, error } = await supabase
            .from('table_name')
            .select('*')
            .eq('user_id', userId);
        
        if (error) throw error;
        setData(data);
    } catch (error) {
        logger.error('Fetch failed', { error });
        showError('Failed to load data');
    }
};
```

### Form Handling

```javascript
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Process form
        showSuccess('Success!');
    } catch (error) {
        logger.error('Submit failed', { error });
        showError(error.message);
    }
};
```

---

## Testing Components

Use React Testing Library for component tests:

```javascript
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';

test('renders module cards', () => {
    render(
        <BrowserRouter>
            <Dashboard />
        </BrowserRouter>
    );
    expect(screen.getByText(/laboratory/i)).toBeInTheDocument();
});
```

---

## Support

For component-specific questions, refer to:
- React documentation: https://react.dev
- Three.js documentation: https://threejs.org
- React Three Fiber: https://docs.pmnd.rs/react-three-fiber
