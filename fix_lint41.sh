#!/bin/bash
cd client
git checkout src/components/StudentAnalyticsChart.jsx
sed -i "s/export const EmptyChartState/const EmptyChartState/g" src/components/StudentAnalyticsChart.jsx
sed -i "s/EmptyChartState;/EmptyChartState;\nEmptyChartState.displayName = 'EmptyChartState';/g" src/components/StudentAnalyticsChart.jsx

cat << 'PY_EOF' > fix_chart2.py
with open("src/components/StudentAnalyticsChart.jsx", "r") as f:
    text = f.read()

# Just append the display name if it's exported inline
if "EmptyChartState.displayName" not in text:
    text += "\nEmptyChartState.displayName = 'EmptyChartState';\n"
with open("src/components/StudentAnalyticsChart.jsx", "w") as f:
    f.write(text)
PY_EOF
git checkout src/components/StudentAnalyticsChart.jsx
python3 fix_chart2.py

pnpm lint --max-warnings=100
