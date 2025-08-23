#!/usr/bin/env bun
import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const projectName = process.argv[2] || "my-app";
const useTs = process.argv.includes("--ts");

console.log(`🚀 Creating project: ${projectName}`);
const projectPath = path.join(process.cwd(), projectName);

// Step 1: Create Vite app
execSync(
  `bunx create-vite@latest ${projectName} --template ${
    useTs ? "react-ts" : "react"
  }`,
  {
    stdio: "inherit",
  }
);

// Step 2: Install dependencies
process.chdir(projectPath);
console.log("📦 Installing dependencies...");
execSync("bun add -D tailwindcss postcss autoprefixer", { stdio: "inherit" });
execSync("bun add daisyui lucide-react react-router-dom", { stdio: "inherit" });

// Step 3: Init Tailwind
execSync("bunx tailwindcss init -p", { stdio: "inherit" });

// Step 4: Configure Tailwind + DaisyUI
const tailwindConfig = `
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}
`;
fs.writeFileSync(path.join(projectPath, "tailwind.config.js"), tailwindConfig);

const cssFile = path.join(projectPath, "src", "index.css");
fs.writeFileSync(
  cssFile,
  `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n`
);

// Step 5: Success message
console.log(`
✅ Project setup complete!

👉 cd ${projectName}
👉 bun dev
`);
