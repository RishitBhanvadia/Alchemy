#!/bin/bash
cd client

cat << 'PY_EOF' > fix_chart.py
with open("src/components/StudentAnalyticsChart.jsx", "r") as f:
    content = f.read()

# Ah, the component is missing display name. It's the `StudentAnalyticsChart` itself that is missing the displayName because it's wrapped in React.memo!
# Line 61: const StudentAnalyticsChart = React.memo(({ scores = [], experimentName = '', noDataMessage }) => {
content = content.replace("const StudentAnalyticsChart = React.memo(({ scores = [], experimentName = '', noDataMessage }) => {", "const StudentAnalyticsChart = React.memo(({ scores = [], experimentName = '', noDataMessage }) => {")
if "StudentAnalyticsChart.displayName" not in content:
    content = content.replace("export default StudentAnalyticsChart;", "StudentAnalyticsChart.displayName = 'StudentAnalyticsChart';\nexport default StudentAnalyticsChart;")

with open("src/components/StudentAnalyticsChart.jsx", "w") as f:
    f.write(content)
PY_EOF

python3 fix_chart.py
pnpm lint --max-warnings=100
