import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";

const ARTIFACT_DIR = "/Users/ebenyoub/.gemini/antigravity-cli/brain/2d6990df-f746-48c6-95ea-fede22b66963";
const SCREENSHOT_DIR = path.join(ARTIFACT_DIR, "screenshots");

async function main() {
  await fs.mkdir(SCREENSHOT_DIR, { recursive: true });
  
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  const consoleLogs = [];
  page.on("console", (msg) => {
    consoleLogs.push({ type: msg.type(), text: msg.text() });
  });

  const networkRequests = [];
  page.on("request", (req) => {
    networkRequests.push({ url: req.url(), method: req.method() });
  });
  
  const networkResponses = [];
  page.on("response", (res) => {
    networkResponses.push({ url: res.url(), status: res.status() });
  });

  console.log("=== 1. Connexion ===");
  await page.goto("http://localhost:8080/login", { waitUntil: "networkidle" });
  await page.fill('input[type="email"]', "admin@portfolio.fr");
  await page.fill('input[type="password"]', "admin");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/admin/dashboard", { waitUntil: "networkidle" });
  console.log("Authentification réussie !");

  const adminPages = [
    { name: "dashboard", url: "http://localhost:8080/admin/dashboard" },
    { name: "projects", url: "http://localhost:8080/admin/projects" },
    { name: "parcours", url: "http://localhost:8080/admin/parcours" },
    { name: "competences", url: "http://localhost:8080/admin/competences" },
    { name: "medias", url: "http://localhost:8080/admin/medias" },
    { name: "parametres", url: "http://localhost:8080/admin/parametres" }
  ];

  console.log("\n=== 2. Visite des pages admin ===");
  for (const adminPage of adminPages) {
    consoleLogs.length = 0; // Clear console logs for this page load
    console.log(`Visite de la page: ${adminPage.name}`);
    await page.goto(adminPage.url, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    
    // Screenshot
    const screenshotPath = path.join(SCREENSHOT_DIR, `${adminPage.name}.png`);
    await page.screenshot({ path: screenshotPath });
    console.log(`  Capture d'écran sauvegardée : ${screenshotPath}`);

    // Check for placeholders or empty states
    const content = await page.textContent("body");
    const hasPlaceholder = content.includes("Module en cours de développement");
    console.log(`  Placeholder présent ? ${hasPlaceholder ? "OUI (ERREUR)" : "NON"}`);

    // Check console errors
    const errors = consoleLogs.filter(log => log.type === "error");
    console.log(`  Erreurs de console : ${errors.length}`);
    errors.forEach(err => console.log(`    -> ${err.text}`));
  }

  console.log("\n=== 3. Test CRUD Parcours ===");
  await page.goto("http://localhost:8080/admin/parcours", { waitUntil: "networkidle" });
  
  // click add
  await page.click("text=Ajouter une étape");
  await page.waitForSelector('input[name="year"]');
  
  // fill form
  await page.fill('input[name="year"]', "2026");
  await page.fill('input[name="title"]', "Playwright Automated Test");
  await page.fill('input[name="subtitle"]', "Validation Qualité");
  await page.fill('textarea[name="description"]', "Test de bout en bout automatisé par un agent Gemini.");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  // check if item exists in list
  let hasCreated = await page.isVisible("text=Playwright Automated Test");
  console.log(`Création réussie ? ${hasCreated ? "OUI" : "NON (ERREUR)"}`);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "parcours_added.png") });

  // edit item
  await page.click('button[aria-label="Modifier"]'); // click modify on first matching
  await page.waitForSelector('input[name="title"]');
  await page.fill('input[name="title"]', "Playwright Automated Test Updated");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  // check if updated title exists
  let hasUpdated = await page.isVisible("text=Playwright Automated Test Updated");
  console.log(`Mise à jour réussie ? ${hasUpdated ? "OUI" : "NON (ERREUR)"}`);
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, "parcours_updated.png") });

  // delete item
  // Click delete and handle confirmation alert
  page.once("dialog", dialog => dialog.accept());
  await page.click('button[aria-label="Supprimer"]');
  await page.waitForTimeout(2000);

  let hasDeleted = !(await page.isVisible("text=Playwright Automated Test Updated"));
  console.log(`Suppression réussie ? ${hasDeleted ? "OUI" : "NON (ERREUR)"}`);

  console.log("\n=== 4. Test Paramètres ===");
  await page.goto("http://localhost:8080/admin/parametres", { waitUntil: "networkidle" });
  await page.fill('input[name="title"]', "Architecte React & TypeScript");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  // reload to check persistence
  await page.reload({ waitUntil: "networkidle" });
  const titleVal = await page.inputValue('input[name="title"]');
  console.log(`Persistance des paramètres : ${titleVal === "Architecte React & TypeScript" ? "OK" : "KO (ERREUR)"}`);

  // Revert back
  await page.fill('input[name="title"]', "Développeur Web React & Full-Stack");
  await page.click('button[type="submit"]');
  await page.waitForTimeout(2000);

  await browser.close();
  console.log("\n=== Validation terminée avec succès ===");
}

main().catch((err) => {
  console.error("Erreur de script de validation :", err);
  process.exit(1);
});
