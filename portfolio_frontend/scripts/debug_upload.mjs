import { chromium } from "@playwright/test";
import path from "node:path";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on("console", msg => console.log(`[CONSOLE] ${msg.type()}: ${msg.text()}`));
  page.on("response", async res => {
    if (res.url().includes("cloudinary") || res.url().includes("medias")) {
      console.log(`[RESPONSE] ${res.status()} - ${res.url()}`);
      try {
        const text = await res.text();
        console.log(`Payload: ${text}`);
      } catch (e) {
        console.log(`Could not read text: ${e.message}`);
      }
    }
  });

  console.log("Connexion en cours...");
  await page.goto("http://localhost:8080/login", { waitUntil: "networkidle" });
  await page.fill('input[type="email"]', "admin@portfolio.fr");
  await page.fill('input[type="password"]', "admin");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/admin/dashboard", { waitUntil: "networkidle" });
  
  console.log("Navigation vers la médiathèque...");
  await page.goto("http://localhost:8080/admin/medias", { waitUntil: "networkidle" });

  const fileInput = await page.locator('input[type="file"]');
  const filePath = path.resolve("public/profile.jpg");
  
  await fileInput.setInputFiles(filePath);
  console.log("Upload initié...");
  
  await page.waitForTimeout(5000);
  await browser.close();
}

run();
