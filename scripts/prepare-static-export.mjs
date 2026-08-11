import { existsSync, rmSync } from "node:fs";

const staleRoutes = [
  "src/app/robots.ts",
  "src/app/sitemap.ts",
];

for (const route of staleRoutes) {
  if (existsSync(route)) {
    rmSync(route, { force: true });
  }
}
