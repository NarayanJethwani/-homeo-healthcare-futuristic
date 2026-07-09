"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Portal;
const react_1 = require("react");
const react_dom_1 = require("react-dom");
function Portal({ children }) {
    const [mounted, setMounted] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);
    return mounted ? (0, react_dom_1.createPortal)(children, document.body) : null;
}
