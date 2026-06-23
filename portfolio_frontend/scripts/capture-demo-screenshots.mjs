import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const args = process.argv.slice(2);

const getArgValue = (name) => {
  const index = args.indexOf(name);
  if (index === -1) return null;

  return args[index + 1] ?? null;
};

const hasFlag = (name) => args.includes(name);

const frontendRoot = process.cwd();
const workspaceRoot = path.resolve(frontendRoot, "..");
const outputRoot = path.resolve(frontendRoot, getArgValue("--output-root") ?? "public/project-images");
const reportsRoot = path.resolve(workspaceRoot, getArgValue("--report-dir") ?? "reports");
const apiUrl = getArgValue("--api-url") ?? process.env.VITE_API_URL ?? "http://localhost:3001/api";
const requestedIds = (getArgValue("--ids") ?? "")
  .split(",")
  .map((id) => Number(id.trim()))
  .filter(Number.isInteger);
const includeWithoutDemo = hasFlag("--include-without-demo");
const captureDelay = Number(getArgValue("--delay") ?? "3000");

const legacyProjects = [
  { id: null, title: "Kasa", slug: "kasa", demo_url: "https://ebenyoub.github.io/Kasa/" },
  { id: null, title: "SportSee", slug: "sportsee", demo_url: "https://ebenyoub.github.io/sportSee_front/" },
  { id: null, title: "OhMyFood", slug: "ohmyfood", demo_url: "https://ebenyoub.github.io/ocr_p3_ohmyfood/" },
  { id: null, title: "Book List Redux", slug: "book-list-redux", demo_url: "https://ebenyoub.github.io/book_list_redux/" },
];

const slugify = (value) => value
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

const isHttpUrl = (value) => {
  if (!value) return false;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const fetchPortfolioProjects = async () => {
  try {
    const response = await fetch(`${apiUrl}/projects`);
    if (!response.ok) {
      throw new Error(`API ${response.status}`);
    }

    const payload = await response.json();
    return Array.isArray(payload.data) ? payload.data : legacyProjects;
  } catch {
    return legacyProjects;
  }
};

const getCaptureTargets = async () => {
  const projects = await fetchPortfolioProjects();
  const filteredProjects = requestedIds.length > 0
    ? projects.filter((project) => requestedIds.includes(project.id))
    : projects;
  const foundIds = new Set(filteredProjects.map((project) => project.id));
  const missingIds = requestedIds.filter((id) => !foundIds.has(id));

  const targets = filteredProjects
    .filter((project) => includeWithoutDemo || isHttpUrl(project.demo_url))
    .map((project) => ({
      id: project.id,
      title: project.title,
      slug: project.slug ?? slugify(project.title),
      demo_url: project.demo_url,
      github_url: project.github_url ?? null,
    }));

  return { targets, missingIds };
};

const waitForPage = async (page) => {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForLoadState("networkidle", { timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(captureDelay);
};

const inspectPage = async (page) => {
  return page.evaluate(() => {
    const text = document.body?.innerText?.trim() || "";
    const body = document.body?.getBoundingClientRect();
    const visibleElements = [...document.querySelectorAll("body *")].filter((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 2
        && rect.height > 2
        && style.visibility !== "hidden"
        && style.display !== "none";
    });

    return {
      hasText: text.length > 20,
      textLength: text.length,
      height: Math.ceil(document.documentElement.scrollHeight),
      bodyHeight: Math.ceil(body?.height || 0),
      visibleElementCount: visibleElements.length,
      title: document.title,
    };
  });
};

const isUsableState = (response, state) => {
  return Boolean(response)
    && response.status() < 400
    && state.hasText
    && state.bodyHeight >= 200
    && state.visibleElementCount >= 5;
};

const captureProject = async (browser, project) => {
  if (!isHttpUrl(project.demo_url)) {
    return {
      ...project,
      skipped: true,
      reason: "Aucune demo_url exploitable.",
      screenshots: [],
    };
  }

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  try {
    const response = await page.goto(project.demo_url, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    await waitForPage(page);
    const state = await inspectPage(page);

    if (!isUsableState(response, state)) {
      return {
        ...project,
        skipped: true,
        reason: `Page non exploitable (${response?.status() || "no response"}).`,
        screenshots: [],
        state,
      };
    }

    const outputDir = path.join(outputRoot, project.slug);
    await fs.mkdir(outputDir, { recursive: true });

    const screenshots = [];
    const firstPath = path.join(outputDir, "screenshot-1.png");
    await page.screenshot({ path: firstPath, fullPage: false });
    screenshots.push(`/project-images/${project.slug}/screenshot-1.png`);

    if (state.height > 1150) {
      await page.evaluate(() => window.scrollTo(0, Math.min(window.innerHeight, document.documentElement.scrollHeight)));
      await page.waitForTimeout(1000);
      const secondPath = path.join(outputDir, "screenshot-2.png");
      await page.screenshot({ path: secondPath, fullPage: false });
      screenshots.push(`/project-images/${project.slug}/screenshot-2.png`);
    }

    return {
      ...project,
      skipped: false,
      reason: null,
      screenshots,
      state,
    };
  } catch (error) {
    return {
      ...project,
      skipped: true,
      reason: error instanceof Error ? error.message : "Erreur inconnue pendant la capture.",
      screenshots: [],
    };
  } finally {
    await page.close();
  }
};

const { targets, missingIds } = await getCaptureTargets();
const browser = await chromium.launch();
const results = [];

for (const project of targets) {
  results.push(await captureProject(browser, project));
}

await browser.close();

await fs.mkdir(reportsRoot, { recursive: true });
const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const reportPath = path.join(reportsRoot, `screenshot-capture-${timestamp}.json`);
const report = {
  generated_at: new Date().toISOString(),
  api_url: apiUrl,
  requested_ids: requestedIds,
  missing_ids: missingIds,
  include_without_demo: includeWithoutDemo,
  captured: results.filter((result) => !result.skipped),
  skipped: results.filter((result) => result.skipped),
};

await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(JSON.stringify({
  report: path.relative(workspaceRoot, reportPath),
  captured: report.captured.length,
  skipped: report.skipped.length,
  missing_ids: missingIds,
  results,
}, null, 2));
