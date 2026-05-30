# Check coverage
ls client/coverage/ 2>/dev/null | head -5
cat client/coverage/coverage-summary.json 2>/dev/null | python3 -c "
import json,sys
d = json.load(sys.stdin)
total = d.get('total', {})
print(f\"Lines: {total.get('lines',{}).get('pct','?')}%\")
print(f\"Functions: {total.get('functions',{}).get('pct','?')}%\")
print(f\"Branches: {total.get('branches',{}).get('pct','?')}%\")
" 2>/dev/null || echo "No coverage data found"
