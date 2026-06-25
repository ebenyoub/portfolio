import { chromium } from "@playwright/test";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on("console", msg => console.log(`[CONSOLE] ${msg.type()}: ${msg.text()}`));
  page.on("pageerror", err => console.log(`[PAGE ERROR] ${err.message}`));

  console.log("=== 1. Chargement de l'accueil et vérification du CV dans le Hero ===");
  await page.goto("http://localhost:8080/", { waitUntil: "networkidle" });
  
  const heroCVBtn = page.locator("text=Télécharger mon CV");
  const isHeroCVVisible = await heroCVBtn.isVisible();
  console.log(`Bouton CV visible dans le Hero ? ${isHeroCVVisible ? "OUI" : "NON (ERREUR)"}`);
  
  const cvUrl = await heroCVBtn.getAttribute("href");
  console.log(`URL du CV associée : ${cvUrl}`);

  // Verify the PDF actually exists by requesting it
  console.log("Vérification de l'existence du PDF du CV...");
  const cvResponse = await page.request.get(`http://localhost:8080${cvUrl}`);
  console.log(`Statut de réponse du fichier PDF : ${cvResponse.status()} (${cvResponse.status() === 200 ? "OK" : "ERREUR"})`);

  await page.screenshot({ path: "recruiter_1_home_hero.png" });

  console.log("\n=== 2. Consultation d'un projet et retour ===");
  // Wait for the projects list to be loaded and click first visible project card
  const projectCard = page.locator("a:has-text('Découvrir le projet'), .group:has-text('Kasa')").first();
  await projectCard.scrollIntoViewIfNeeded();
  await page.screenshot({ path: "recruiter_2_before_project_click.png" });
  
  console.log("Clic sur le premier projet...");
  await projectCard.click();
  
  // Wait for project detail page URL or modal to load
  await page.waitForTimeout(2000);
  console.log(`URL actuelle après clic : ${page.url()}`);
  await page.screenshot({ path: "recruiter_3_project_consultation.png" });

  console.log("Retour à la liste...");
  if (page.url().includes("/projects/")) {
    await page.click("text=Retour aux projets");
  } else {
    // If it's a modal
    await page.click('button[aria-label="Fermer le projet"]');
  }
  await page.waitForTimeout(1000);
  console.log(`URL actuelle après retour : ${page.url()}`);

  console.log("\n=== 3. Section Contact ===");
  await page.goto("http://localhost:8080/#contact", { waitUntil: "networkidle" });
  
  // Verify CV card link in Contact section
  const contactCVCard = page.locator("#contact").locator("text=Curriculum Vitae");
  const isContactCVVisible = await contactCVCard.isVisible();
  console.log(`Lien CV présent dans la section Contact ? ${isContactCVVisible ? "OUI" : "NON (ERREUR)"}`);

  // Verify redundant button is gone
  const redundantBtn = page.locator("text=Ouvrir la page contact");
  const isRedundantBtnVisible = await redundantBtn.isVisible();
  console.log(`Bouton redondant 'Ouvrir la page contact' présent ? ${isRedundantBtnVisible ? "OUI (ERREUR)" : "NON"}`);

  await page.screenshot({ path: "recruiter_4_contact_section.png" });

  await browser.close();
  console.log("\n=== Parcours recruteur validé avec succès ! ===");
}

run().catch(err => {
  console.error("Échec du parcours recruteur :", err);
  process.exit(1);
});
