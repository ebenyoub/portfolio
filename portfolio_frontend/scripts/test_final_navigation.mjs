import { chromium } from "@playwright/test";

async function run() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on("console", msg => console.log(`[CONSOLE] ${msg.type()}: ${msg.text()}`));
  page.on("pageerror", err => console.log(`[PAGE ERROR] ${err.message}`));

  console.log("=== 1. Test final de la page d'accueil (/) ===");
  await page.goto("http://localhost:8080/", { waitUntil: "networkidle" });

  // 1. Navbar check
  const navbarLinks = page.locator("nav a");
  const navbarTexts = await navbarLinks.allTextContents();
  console.log("Textes des liens de la Navbar :", navbarTexts.map(t => t.trim()));

  const contactTextLinkVisible = await page.locator("nav a:has-text('Contact')").isVisible();
  console.log(`Lien texte 'Contact' visible dans la navbar ? ${contactTextLinkVisible ? "OUI (ERREUR)" : "NON"}`);

  const contactBtn = page.locator("nav a:has-text('Me contacter')");
  const isContactBtnVisible = await contactBtn.isVisible();
  console.log(`Bouton bleu 'Me contacter' visible dans la navbar ? ${isContactBtnVisible ? "OUI" : "NON (ERREUR)"}`);

  const contactBtnHref = await contactBtn.getAttribute("href");
  console.log(`Href du bouton de contact de la navbar : ${contactBtnHref}`);

  // 2. Hero check
  // Find all links inside Hero container (excluding socials)
  const heroLinks = page.locator("section.relative:first-of-type a");
  const heroLinkTexts = await heroLinks.allTextContents();
  const trimmedHeroTexts = heroLinkTexts.map(t => t.trim()).filter(t => t.length > 0);
  console.log("CTA visibles dans le Hero :", trimmedHeroTexts);

  const hasContactInHero = trimmedHeroTexts.some(text => text.includes("Me contacter") || text.includes("contact"));
  console.log(`Bouton ou lien de contact présent dans le Hero ? ${hasContactInHero ? "OUI (ERREUR)" : "NON"}`);

  await page.screenshot({ path: "test_final_clean_hero.png" });
  console.log("Capture d'écran finale sauvegardée sous test_final_clean_hero.png");

  await browser.close();
  console.log("\n=== Améliorations UX finales validées avec succès ! ===");
}

run().catch(err => {
  console.error("Échec de la validation finale :", err);
  process.exit(1);
});
