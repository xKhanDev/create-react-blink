#!/usr/bin/env node
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const projectName = process.argv[2] || "my-app";
const useTs = process.argv.includes("--ts");

console.log(`🚀 Creating project: ${projectName}`);
const projectPath = path.join(process.cwd(), projectName);

// Step 1: Create Vite app
execSync(
  `npx create-vite@latest ${projectName} --template ${
    useTs ? "react-ts" : "react"
  }`,
  { stdio: "inherit" }
);

// Step 2: Change dir
process.chdir(projectPath);

// Step 3: Install dependencies
console.log("📦 Installing dependencies...");
execSync("npm install -D tailwindcss postcss autoprefixer", { stdio: "inherit" });
execSync("npm install daisyui lucide-react react-router-dom", { stdio: "inherit" });

// Step 4: Init Tailwind
execSync("npx tailwindcss init -p", { stdio: "inherit" });

// Step 5: Configure Tailwind + DaisyUI
const tailwindConfig = `
// tailwind.config.js
import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
};
`;
fs.writeFileSync(path.join(projectPath, "tailwind.config.js"), tailwindConfig);

// index.css
fs.writeFileSync(
  path.join(projectPath, "src", "index.css"),
  `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`
);

// Step 6: Done
console.log(`
✅ Project setup complete!

👉 cd ${projectName}
👉 npm run dev
`);