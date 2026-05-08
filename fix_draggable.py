with open('client/src/components/3d-animations/DraggableFlask.jsx', 'r') as f:
    content = f.read()

if "/* eslint-disable react-hooks/immutability */" not in content:
    content = "/* eslint-disable react-hooks/immutability */\n" + content

with open('client/src/components/3d-animations/DraggableFlask.jsx', 'w') as f:
    f.write(content)
