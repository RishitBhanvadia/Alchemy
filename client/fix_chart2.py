import re

with open("src/components/StudentAnalyticsChart.jsx", "r") as f:
    content = f.read()

# Search for the exact line and replace it, because our previous sed failed to replace it
# "export const EmptyChartState" wasn't there?
# Let's see if EmptyChartState exists.
if "EmptyChartState" in content:
    content = re.sub(r'export const EmptyChartState = \(\{ noDataMessage \}\) => \(', r"const EmptyChartState = ({ noDataMessage }) => (", content)
    if "EmptyChartState.displayName = " not in content:
        content += "\nEmptyChartState.displayName = 'EmptyChartState';\nexport { EmptyChartState };\n"
    with open("src/components/StudentAnalyticsChart.jsx", "w") as f:
        f.write(content)
else:
    print("EmptyChartState NOT FOUND in StudentAnalyticsChart")
