const fs = require('fs');
const filePath = 'client/src/components/CursorFollower.jsx';
let content = fs.readFileSync(filePath, 'utf8');

// The early return `if (isTouchDevice) return null;` is causing a hook violation.
// We must move ALL hooks above this early return.

const search = `    const [clicking, setClicking] = useState(false);
    const [hovering, setHovering] = useState(false);

    if (isTouchDevice) return null;`;

const replace = `    const [clicking, setClicking] = useState(false);
    const [hovering, setHovering] = useState(false);

    useEffect(() => {
        if (isTouchDevice) return;
        const addEventListeners = () => {
            document.addEventListener("mousemove", onMouseMove);
            document.addEventListener("mouseenter", onMouseEnter);
            document.addEventListener("mouseleave", onMouseLeave);
            document.addEventListener("mousedown", onMouseDown);
            document.addEventListener("mouseup", onMouseUp);
        };

        const removeEventListeners = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseenter", onMouseEnter);
            document.removeEventListener("mouseleave", onMouseLeave);
            document.removeEventListener("mousedown", onMouseDown);
            document.removeEventListener("mouseup", onMouseUp);
        };

        const onMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });

            // Check if hovering over clickable elements
            const target = e.target;
            const isClickable =
                target.tagName.toLowerCase() === 'button' ||
                target.tagName.toLowerCase() === 'a' ||
                target.closest('button') ||
                target.closest('a') ||
                target.classList.contains('clickable');

            setHovering(!!isClickable);
        };

        const onMouseEnter = () => {
            setHidden(false);
        };

        const onMouseLeave = () => {
            setHidden(true);
        };

        const onMouseDown = () => {
            setClicking(true);
        };

        const onMouseUp = () => {
            setClicking(false);
        };

        addEventListeners();
        return () => removeEventListeners();
    }, [isTouchDevice]);

    if (isTouchDevice) return null;`;

// But the file actually looks like this:
/*
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hidden, setHidden] = useState(false);
    const [clicking, setClicking] = useState(false);
    const [hovering, setHovering] = useState(false);

    if (isTouchDevice) return null;

    useEffect(() => {
*/

content = content.replace('    if (isTouchDevice) return null;\n\n    useEffect(() => {\n', '    useEffect(() => {\n        if (isTouchDevice) return;\n');
content = content.replace('    }, []);\n\n    const cursorClasses', '    }, [isTouchDevice]);\n\n    if (isTouchDevice) return null;\n\n    const cursorClasses');

fs.writeFileSync(filePath, content, 'utf8');
