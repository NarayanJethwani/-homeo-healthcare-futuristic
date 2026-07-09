"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = manifest;
const headers_1 = require("next/headers");
async function manifest() {
    const headersList = await (0, headers_1.headers)();
    const host = headersList.get("host") || "";
    // Check if it is the admin portal domain
    const isPortal = host.includes("portal.homeo.healthcare");
    if (isPortal) {
        return {
            name: "Dr. Jethwani's Clinical Repertory",
            short_name: "Clinical Repertory",
            description: "Dr. Jethwani's Homeopathic Repertory and Clinical Portal",
            start_url: "/admin/dashboard",
            display: "standalone",
            background_color: "#040C14",
            theme_color: "#040C14",
            orientation: "any",
            scope: "/",
            icons: [
                {
                    src: "/icon.png",
                    sizes: "512x512",
                    type: "image/png",
                    purpose: "maskable"
                }
            ]
        };
    }
    // Client-facing public website manifest
    return {
        name: "Homeo Healthcare",
        short_name: "Homeo Healthcare",
        description: "Advanced Homeopathic Care for Modern Life",
        start_url: "/",
        display: "standalone",
        background_color: "#040C14",
        theme_color: "#040C14",
        orientation: "any",
        scope: "/",
        icons: [
            {
                src: "/icon.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable"
            }
        ]
    };
}
