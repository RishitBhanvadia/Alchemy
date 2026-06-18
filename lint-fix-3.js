const fs = require('fs');

// CursorFollower.jsx
let cursorFollowerJsx = fs.readFileSync('client/src/components/CursorFollower.jsx', 'utf8');
cursorFollowerJsx = cursorFollowerJsx.replace(/    \}, \[\]\);/g, "    }, [isTouchDevice]);");
fs.writeFileSync('client/src/components/CursorFollower.jsx', cursorFollowerJsx);

// TeacherDashboard.jsx
let teacherDashboardJsx = fs.readFileSync('client/src/pages/TeacherDashboard.jsx', 'utf8');
teacherDashboardJsx = teacherDashboardJsx.replace(/import PropTypes from 'prop-types';\nimport PropTypes from 'prop-types';/, "import PropTypes from 'prop-types';");
fs.writeFileSync('client/src/pages/TeacherDashboard.jsx', teacherDashboardJsx);

// CTAButton.jsx
let ctaButtonJsx = fs.readFileSync('client/src/components/auth/CTAButton.jsx', 'utf8');
ctaButtonJsx = ctaButtonJsx.replace(/import \{ Loader2.*?\} from 'lucide-react';/g, "import { ArrowRight, UserPlus } from 'lucide-react';");
fs.writeFileSync('client/src/components/auth/CTAButton.jsx', ctaButtonJsx);
