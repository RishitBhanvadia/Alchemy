const fs = require('fs');

function replaceFile(path, replacements) {
    let content = fs.readFileSync(path, 'utf-8');
    for (let r of replacements) {
        content = content.replace(r.search, r.replace);
    }
    fs.writeFileSync(path, content);
}


replaceFile('client/src/components/auth/LoginForm.jsx', [
    { search: /<a href="#" onClick=\{handleTeacherLogin\}/g, replace: `<button type="button" className="demo-login-btn" onClick={handleTeacherLogin}` },
    { search: /Teacher Demo<\/a>/, replace: `Teacher Demo</button>` },
    { search: /<a href="#" onClick=\{handleStudentLogin\}/g, replace: `<button type="button" className="demo-login-btn" onClick={handleStudentLogin}` },
    { search: /Student Demo<\/a>/, replace: `Student Demo</button>` },
    { search: /const navigate = useNavigate\(\);/, replace: "" },
    { search: /import \{ useState \} from 'react';\nimport \{ useNavigate \} from 'react-router-dom';/, replace: "import { useState } from 'react';\n// import { useNavigate } from 'react-router-dom';" },
    { search: /<a href="#" className="forgot-password">/, replace: `<button type="button" className="forgot-password">` },
    { search: /Forgot Password\?<\/a>/, replace: `Forgot Password?</button>` }
]);

replaceFile('client/src/components/StudentAnalyticsChart.jsx', [
    { search: /export default memo\(function \(\{ data, title = "Analytics", type = "bar" \}\) \{/, replace: "const StudentAnalyticsChart = memo(function StudentAnalyticsChart({ data, title = \"Analytics\", type = \"bar\" }) {" },
    { search: /    \}\)\(\);\n  \}, \[data, type, chartInstance\]\);\n\n  return \(/, replace: "    })();\n  }, [data, type, chartInstance]);\n\n  return (" },
    { search: /  \);\n\}\);/, replace: "  );\n});\nStudentAnalyticsChart.displayName = 'StudentAnalyticsChart';\nexport default StudentAnalyticsChart;" }
]);

replaceFile('client/src/components/auth/SignUpForm.jsx', [
    { search: /const confirmPassword = formData\.get\('confirmPassword'\);/, replace: "// const confirmPassword = formData.get('confirmPassword');" },
    { search: /const authData = await signUp\(\{/, replace: "await signUp({" }
]);

replaceFile('client/src/components/AiTutorPanel.jsx', [
    { search: /I don't understand that./, replace: "I don&apos;t understand that." }
]);

replaceFile('client/src/pages/Dashboard.jsx', [
    { search: /Don't have an account\?/, replace: "Don&apos;t have an account?" }
]);
