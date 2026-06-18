const fs = require('fs');

// TeacherDashboard.jsx
let teacherDashboardJsx = fs.readFileSync('client/src/pages/TeacherDashboard.jsx', 'utf8');
teacherDashboardJsx = teacherDashboardJsx.replace(/import PropTypes from 'prop-types';\nexport default function TeacherDashboard/, "export default function TeacherDashboard");
fs.writeFileSync('client/src/pages/TeacherDashboard.jsx', teacherDashboardJsx);

// CTAButton.jsx
let ctaButtonJsx = fs.readFileSync('client/src/components/auth/CTAButton.jsx', 'utf8');
ctaButtonJsx = ctaButtonJsx.replace(/import \{ ArrowRight, UserPlus \} from 'lucide-react';/, "import { ArrowRight, UserPlus } from 'lucide-react';\n");
ctaButtonJsx = ctaButtonJsx.replace(/import \{ Loader2, /, "import { ");
fs.writeFileSync('client/src/components/auth/CTAButton.jsx', ctaButtonJsx);
