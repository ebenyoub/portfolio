import { chromium } from "@playwright/test";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on("console", msg => console.log(`[CONSOLE] ${msg.type()}: ${msg.text()}`));
  page.on("pageerror", err => console.log(`[PAGE ERROR] ${err.message}`));

  console.log("Navigation vers la page détail du projet Kasa (ID: 13)...");
  await page.goto("http://localhost:8080/projects/13", { waitUntil: "networkidle" });
  
  // Verify main elements are present
  const title = await page.textContent("h1");
  console.log(`Titre de la page chargé : ${title}`);
  
  const techStackVisible = await page.isVisible("text=Technologies utilisées");
  console.log(`Stack technique visible ? ${techStackVisible ? "OUI" : "NON"}`);

  const contextVisible = await page.isVisible("text=Contexte & Défi");
  console.log(`Contexte visible ? ${contextVisible ? "OUI" : "NON"}`);

  // Take screenshot
  await page.screenshot({ path: "project_detail_premium.png", fullPage: true });
  console.log("Capture d'écran de la page détail sauvegardée sous project_detail_premium.png");

  await browser.close();
}

run().catch(err => {
  console.error("Test échoué :", err);
  process.exit(1);
});
