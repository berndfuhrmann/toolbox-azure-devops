export interface DemoFile {
  path: string;
  content: string;
}

export interface DemoCommit {
  message: string;
  files: DemoFile[];
}

export interface DemoBranch {
  name: string;
  sourceBranch?: string;
  commits: DemoCommit[];
}

export interface DemoPullRequest {
  title: string;
  description: string;
  sourceBranch: string;
  targetBranch: string;
}

export interface DemoTag {
  name: string;
  message: string;
  onBranch: string;
}

export interface DemoRepository {
  name: string;
  defaultBranch: string;
  initialCommit: DemoCommit;
  branches: DemoBranch[];
  pullRequests: DemoPullRequest[];
  tags: DemoTag[];
}

export interface DemoProject {
  name: string;
  description: string;
  processTemplate: string;
  repositories: DemoRepository[];
}

export const demoProjects: DemoProject[] = [
  {
    name: "Demo",
    description: "Demo project for Azure DevOps extension development",
    processTemplate: "Agile",
    repositories: [
      {
        name: "frontend",
        defaultBranch: "main",
        initialCommit: {
          message: "Initial commit",
          files: [
            {
              path: "/README.md",
              content: [
                "# Frontend",
                "",
                "Demo frontend application.",
                "",
                "## Getting Started",
                "",
                "```bash",
                "npm install",
                "npm start",
                "```",
                "",
              ].join("\n"),
            },
            {
              path: "/package.json",
              content:
                JSON.stringify(
                  {
                    name: "frontend",
                    version: "1.0.0",
                    scripts: { start: "ts-node src/index.ts", build: "tsc" },
                    dependencies: { typescript: "^5.0.0" },
                  },
                  null,
                  2,
                ) + "\n",
            },
            {
              path: "/src/index.ts",
              content: 'import { App } from "./app";\n\nconst app = new App();\napp.start();\n',
            },
            {
              path: "/src/app.ts",
              content: [
                "export class App {",
                "    start(): void {",
                '        console.log("Frontend application started.");',
                "    }",
                "}",
                "",
              ].join("\n"),
            },
            {
              path: "/.gitignore",
              content: "node_modules/\ndist/\n*.js\n",
            },
          ],
        },
        branches: [
          {
            name: "develop",
            commits: [
              {
                message: "Add environment configuration",
                files: [
                  {
                    path: "/src/config.ts",
                    content: [
                      "export interface Config {",
                      "    apiUrl: string;",
                      "    environment: string;",
                      "}",
                      "",
                      "export const config: Config = {",
                      '    apiUrl: "http://localhost:3000",',
                      '    environment: "development",',
                      "};",
                      "",
                    ].join("\n"),
                  },
                ],
              },
            ],
          },
          {
            name: "feature/login",
            sourceBranch: "develop",
            commits: [
              {
                message: "Add login function",
                files: [
                  {
                    path: "/src/login.ts",
                    content: [
                      "export interface LoginCredentials {",
                      "    username: string;",
                      "    password: string;",
                      "}",
                      "",
                      "export async function login(credentials: LoginCredentials): Promise<boolean> {",
                      '    const response = await fetch("/api/login", {',
                      '        method: "POST",',
                      '        headers: { "Content-Type": "application/json" },',
                      "        body: JSON.stringify(credentials),",
                      "    });",
                      "    return response.ok;",
                      "}",
                      "",
                    ].join("\n"),
                  },
                ],
              },
              {
                message: "Add login form component",
                files: [
                  {
                    path: "/src/LoginForm.ts",
                    content: [
                      'import { login, LoginCredentials } from "./login";',
                      "",
                      "export class LoginForm {",
                      "    async submit(username: string, password: string): Promise<void> {",
                      "        const credentials: LoginCredentials = { username, password };",
                      "        const success = await login(credentials);",
                      "        if (success) {",
                      '            console.log("Login successful");',
                      "        } else {",
                      '            console.error("Login failed");',
                      "        }",
                      "    }",
                      "}",
                      "",
                    ].join("\n"),
                  },
                ],
              },
            ],
          },
        ],
        pullRequests: [
          {
            title: "Add login feature",
            description: "Implements login function and form component.",
            sourceBranch: "feature/login",
            targetBranch: "develop",
          },
          {
            title: "Merge develop into main",
            description: "Regular integration of develop into main.",
            sourceBranch: "develop",
            targetBranch: "main",
          },
        ],
        tags: [
          {
            name: "v1.0.0",
            message: "Version 1.0.0 — initial release",
            onBranch: "main",
          },
        ],
      },
      {
        name: "backend",
        defaultBranch: "main",
        initialCommit: {
          message: "Initial commit",
          files: [
            {
              path: "/README.md",
              content: [
                "# Backend",
                "",
                "Demo backend API.",
                "",
                "## Getting Started",
                "",
                "```bash",
                "npm install",
                "npm start",
                "```",
                "",
              ].join("\n"),
            },
            {
              path: "/package.json",
              content:
                JSON.stringify(
                  {
                    name: "backend",
                    version: "0.1.0",
                    scripts: { start: "ts-node src/server.ts", build: "tsc" },
                    dependencies: { express: "^4.18.0", typescript: "^5.0.0" },
                  },
                  null,
                  2,
                ) + "\n",
            },
            {
              path: "/src/server.ts",
              content: [
                'import express from "express";',
                "",
                "const app = express();",
                "const port = process.env.PORT ?? 3000;",
                "",
                "app.use(express.json());",
                "",
                'app.get("/health", (_req, res) => {',
                '    res.json({ status: "ok" });',
                "});",
                "",
                "app.listen(port, () => {",
                "    console.log(`Server running on port ${port}`);",
                "});",
                "",
              ].join("\n"),
            },
            {
              path: "/.gitignore",
              content: "node_modules/\ndist/\n*.js\n",
            },
          ],
        },
        branches: [
          {
            name: "feature/auth",
            commits: [
              {
                message: "Add JWT authentication middleware",
                files: [
                  {
                    path: "/src/auth.ts",
                    content: [
                      "export interface JwtPayload {",
                      "    userId: string;",
                      "    email: string;",
                      "}",
                      "",
                      "export function verifyToken(token: string): JwtPayload | null {",
                      "    if (!token) return null;",
                      '    return { userId: "1", email: "user@example.com" };',
                      "}",
                      "",
                    ].join("\n"),
                  },
                ],
              },
              {
                message: "Add login endpoint",
                files: [
                  {
                    path: "/src/routes/auth.ts",
                    content: [
                      'import { Router } from "express";',
                      "",
                      "export const authRouter = Router();",
                      "",
                      'authRouter.post("/login", (req, res) => {',
                      "    const { username, password } = req.body as { username: string; password: string };",
                      '    if (username === "demo" && password === "demo") {',
                      '        res.json({ token: "demo-token" });',
                      "    } else {",
                      '        res.status(401).json({ error: "Invalid credentials" });',
                      "    }",
                      "});",
                      "",
                    ].join("\n"),
                  },
                ],
              },
            ],
          },
        ],
        pullRequests: [
          {
            title: "Add JWT authentication",
            description: "Adds JWT-based authentication with login endpoint.",
            sourceBranch: "feature/auth",
            targetBranch: "main",
          },
        ],
        tags: [
          {
            name: "v0.1.0",
            message: "Version 0.1.0 — initial backend release",
            onBranch: "main",
          },
        ],
      },
    ],
  },
];
