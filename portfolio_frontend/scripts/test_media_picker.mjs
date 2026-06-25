import { chromium } from "@playwright/test";

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

  console.log("Navigation vers l'ajout de projet...");
  await page.goto("http://localhost:8080/admin/projects/new", { waitUntil: "networkidle" });

  console.log("Ouverture du Media Picker...");
  // Click Choose (Choisir) button next to Image de couverture
  await page.click('button:has-text("Choisir")');
  
  // Verify modal is open
  const isModalOpen = await page.isVisible("text=Sélectionner un média");
  console.log(`Media Picker ouvert ? ${isModalOpen ? "OUI" : "NON (ERREUR)"}`);

  // Select the profile image we uploaded previously
  const profileThumbnail = page.locator("img[src*='cloudinary.com']").first();
  const isThumbnailVisible = await profileThumbnail.isVisible();
  console.log(`Miniature de l'image présente dans la médiathèque ? ${isThumbnailVisible ? "OUI" : "NON (ERREUR)"}`);

  console.log("Sélection du média...");
  await profileThumbnail.click();

  // Click "Utiliser cette image"
  const selectBtn = page.locator("button:has-text('Utiliser cette image')");
  const isSelectBtnVisible = await selectBtn.isVisible();
  console.log(`Bouton 'Utiliser cette image' visible ? ${isSelectBtnVisible ? "OUI" : "NON (ERREUR)"}`);

  await selectBtn.click();
  console.log("Clic sur 'Utiliser cette image'...");

  // Wait for modal to close
  await page.waitForTimeout(1000);
  
  // Verify image_url input is updated
  const imageUrlValue = await page.inputValue("input[id='image_url']");
  console.log(`URL de l'image insérée dans le formulaire : ${imageUrlValue}`);
  
  const isPreviewShown = await page.locator("div.h-40 img").isVisible();
  console.log(`Aperçu de couverture visible dans le formulaire ? ${isPreviewShown ? "OUI" : "NON (ERREUR)"}`);

  await page.screenshot({ path: "test_media_picker_selected.png" });
  console.log("Capture d'écran sauvegardée sous test_media_picker_selected.png");

  await browser.close();
}

run().catch(err => {
  console.error("Test Media Picker échoué :", err);
  process.exit(1);
});
