const fs = require('fs');

// CursorFollower.jsx
let cursorFollowerJsx = fs.readFileSync('client/src/components/CursorFollower.jsx', 'utf8');
cursorFollowerJsx = cursorFollowerJsx.replace(/    if \(isTouchDevice\) return null;\n\n/, "    const [clicking, setClicking] = useState(false);\n    const [hovering, setHovering] = useState(false);\n\n");
cursorFollowerJsx = cursorFollowerJsx.replace(/    useEffect\(\(\) => \{/g, "    useEffect(() => {\n        if (isTouchDevice) return;\n");
cursorFollowerJsx = cursorFollowerJsx.replace(/    return \(\n        <div/g, "    if (isTouchDevice) return null;\n\n    return (\n        <div");
fs.writeFileSync('client/src/components/CursorFollower.jsx', cursorFollowerJsx);

// CTAButton.jsx
let ctaButtonJsx = fs.readFileSync('client/src/components/auth/CTAButton.jsx', 'utf8');
ctaButtonJsx = ctaButtonJsx.replace(/import \{ Loader2, ArrowRight, UserPlus \} from 'lucide-react';/, "import { ArrowRight, UserPlus } from 'lucide-react';");
fs.writeFileSync('client/src/components/auth/CTAButton.jsx', ctaButtonJsx);

// TeacherDashboard.jsx
let teacherDashboardJsx = fs.readFileSync('client/src/pages/TeacherDashboard.jsx', 'utf8');
teacherDashboardJsx = teacherDashboardJsx.replace(/import PropTypes from 'prop-types';/, "");
teacherDashboardJsx = teacherDashboardJsx.replace(/(export default function TeacherDashboard.*?\n)/, "import PropTypes from 'prop-types';\n$1");
fs.writeFileSync('client/src/pages/TeacherDashboard.jsx', teacherDashboardJsx);
