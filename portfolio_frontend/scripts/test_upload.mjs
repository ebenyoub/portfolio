import { chromium } from "@playwright/test";
import path from "node:path";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on("console", msg => console.log(`[CONSOLE] ${msg.type()}: ${msg.text()}`));
  page.on("pageerror", err => console.log(`[PAGE ERROR] ${err.message}`));

  console.log("Connexion en cours...");
  await page.goto("http://localhost:8080/login", { waitUntil: "networkidle" });
  await page.fill('input[type="email"]', "admin@portfolio.fr");
  await page.fill('input[type="password"]', "admin");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/admin/dashboard", { waitUntil: "networkidle" });
  console.log("Connexion réussie !");

  console.log("Navigation vers la médiathèque...");
  await page.goto("http://localhost:8080/admin/medias", { waitUntil: "networkidle" });

  const fileInput = await page.locator('input[type="file"]');
  const filePath = path.resolve("public/profile.jpg");
  console.log(`Fichier à uploader : ${filePath}`);
  
  // Set file payload
  await fileInput.setInputFiles(filePath);
  console.log("Upload initié...");
  
  // Wait for success toast or response
  await page.waitForSelector("text=Image importée et enregistrée avec succès !", { timeout: 15000 });
  console.log("Upload réussi !");
  
  // Wait a bit for the card to render
  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: "cloudinary_upload_success.png" });
  console.log("Capture d'écran sauvegardée sous cloudinary_upload_success.png");

  await browser.close();
}

run().catch(err => {
  console.error("Test d'upload échoué :", err);
  process.exit(1);
});
