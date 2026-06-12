with open('client/src/pages/history.jsx', 'r') as f:
    content = f.read()

content = content.replace("    </tr>\n});", "    </tr>\n    );\n});")

with open('client/src/pages/history.jsx', 'w') as f:
    f.write(content)
