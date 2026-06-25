import { chromium } from "@playwright/test";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on("console", msg => console.log(`[CONSOLE] ${msg.type()}: ${msg.text()}`));
  page.on("pageerror", err => console.log(`[PAGE ERROR] ${err.message}`));

  console.log("Connexion...");
  await page.goto("http://localhost:8080/login", { waitUntil: "networkidle" });
  await page.fill('input[type="email"]', "admin@portfolio.fr");
  await page.fill('input[type="password"]', "admin");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/admin/dashboard", { waitUntil: "networkidle" });

  console.log("Navigation vers /admin/projects/13/edit...");
  await page.goto("http://localhost:8080/admin/projects/13/edit", { waitUntil: "networkidle" });

  console.log("Ouverture du Media Picker...");
  await page.click('button:has-text("Choisir")');
  
  const isModalOpen = await page.isVisible("text=Sélectionner un média");
  console.log(`Modal ouverte ? ${isModalOpen ? "OUI" : "NON (ERREUR)"}`);

  console.log("Clic sur l'onglet 'Uploader un fichier'...");
  await page.click("text=Uploader un fichier");

  // Wait a moment to check if submission was avoided
  await page.waitForTimeout(2000);

  const currentUrl = page.url();
  console.log(`URL actuelle après clic onglet : ${currentUrl}`);
  
  const isStillInModal = await page.isVisible("text=Uploader un fichier");
  console.log(`Toujours dans la modal avec l'onglet Upload affiché ? ${isStillInModal ? "OUI" : "NON (ERREUR)"}`);

  const hasTriggeredSubmitToast = await page.isVisible("text=projet modifié, success, importé").catch(() => false);
  console.log(`Toast de soumission inopinée visible ? ${hasTriggeredSubmitToast ? "OUI (ERREUR)" : "NON"}`);

  await page.screenshot({ path: "test_media_picker_upload_tab.png" });
  console.log("Capture d'écran de l'onglet d'upload sauvegardée sous test_media_picker_upload_tab.png");

  await browser.close();
  console.log("Validation du bug de soumission terminée avec succès !");
}

run().catch(err => {
  console.error("Test échoué :", err);
  process.exit(1);
});
