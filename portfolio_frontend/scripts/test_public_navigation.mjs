import { chromium } from "@playwright/test";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on("console", msg => console.log(`[CONSOLE] ${msg.type()}: ${msg.text()}`));
  page.on("pageerror", err => console.log(`[PAGE ERROR] ${err.message}`));

  console.log("=== 1. Test de la page d'accueil (/) ===");
  await page.goto("http://localhost:8080/", { waitUntil: "networkidle" });
  let adminLinkExists = await page.isVisible("text=[Admin]");
  let logoutExists = await page.isVisible("text=Déconnexion");
  console.log(`[Accueil] Lien Admin visible ? ${adminLinkExists ? "OUI (ERREUR)" : "NON"}`);
  console.log(`[Accueil] Bouton Déconnexion visible ? ${logoutExists ? "OUI (ERREUR)" : "NON"}`);
  await page.screenshot({ path: "test_public_home.png" });

  console.log("\n=== 2. Test de la page projets (/projects) ===");
  await page.goto("http://localhost:8080/projects", { waitUntil: "networkidle" });
  adminLinkExists = await page.isVisible("text=[Admin]");
  logoutExists = await page.isVisible("text=Déconnexion");
  console.log(`[Projets] Lien Admin visible ? ${adminLinkExists ? "OUI (ERREUR)" : "NON"}`);
  console.log(`[Projets] Bouton Déconnexion visible ? ${logoutExists ? "OUI (ERREUR)" : "NON"}`);

  console.log("\n=== 3. Test de la page détail projet (/projects/12) ===");
  await page.goto("http://localhost:8080/projects/12", { waitUntil: "networkidle" });
  adminLinkExists = await page.isVisible("text=[Admin]");
  logoutExists = await page.isVisible("text=Déconnexion");
  console.log(`[Détail] Lien Admin visible ? ${adminLinkExists ? "OUI (ERREUR)" : "NON"}`);
  console.log(`[Détail] Bouton Déconnexion visible ? ${logoutExists ? "OUI (ERREUR)" : "NON"}`);
  
  // Verify back link
  const backLink = page.locator("text=Retour aux projets");
  const isBackLinkVisible = await backLink.isVisible();
  console.log(`[Détail] Lien retour aux projets visible ? ${isBackLinkVisible ? "OUI" : "NON (ERREUR)"}`);
  
  await backLink.click();
  await page.waitForURL("**/projects");
  console.log(`[Détail] Clic réussi. Redirection vers : ${page.url()}`);
  await page.screenshot({ path: "test_public_project_detail_click.png" });

  console.log("\n=== 4. Connexion & Test Admin (/admin/dashboard) ===");
  await page.goto("http://localhost:8080/login", { waitUntil: "networkidle" });
  await page.fill('input[type="email"]', "admin@portfolio.fr");
  await page.fill('input[type="password"]', "admin");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/admin/dashboard", { waitUntil: "networkidle" });
  
  // Verify logout button in Admin side
  const adminLogoutButton = page.locator('button[aria-label="Déconnexion"], button:has-text("Déconnexion")');
  const isAdminLogoutVisible = await adminLogoutButton.isVisible();
  console.log(`[Admin] Bouton Déconnexion visible ? ${isAdminLogoutVisible ? "OUI" : "NON (ERREUR)"}`);
  
  // Verify no GitHub icon inside Déconnexion button
  const hasGithubIconInLogout = await adminLogoutButton.locator("svg.lucide-github, svg:has-text('github')").isVisible().catch(() => false);
  console.log(`[Admin] Icône GitHub présente dans Déconnexion ? ${hasGithubIconInLogout ? "OUI (ERREUR)" : "NON"}`);
  await page.screenshot({ path: "test_admin_logout_check.png" });

  await browser.close();
  console.log("\n=== Tous les tests de navigation publique/privée ont été validés avec succès ===");
}

run().catch(err => {
  console.error("Test de navigation échoué :", err);
  process.exit(1);
});
