with open("src/hooks/useLabPhysics.js", "r") as f:
    text = f.read()
text = text.replace('catch (e) {', 'catch (_) {')
with open("src/hooks/useLabPhysics.js", "w") as f:
    f.write(text)
