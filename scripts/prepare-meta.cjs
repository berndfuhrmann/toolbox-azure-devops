const fs = require("node:fs");

fs.mkdirSync("dist", { recursive: true });
fs.mkdirSync("dist/docs", { recursive: true });

fs.copyFileSync("README.md", "dist/README.md");
fs.copyFileSync("LICENSE", "dist/LICENSE");
fs.copyFileSync("docs/screenshot1.png", "dist/docs/screenshot1.png");
fs.copyFileSync("docs/user-security.png", "dist/docs/user-security.png");
