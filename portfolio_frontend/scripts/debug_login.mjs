import { chromium } from "@playwright/test";

async function debug() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on("console", msg => console.log(`[CONSOLE] ${msg.type()}: ${msg.text()}`));
  page.on("pageerror", err => console.log(`[PAGE ERROR] ${err.message}`));
  page.on("requestfailed", req => console.log(`[REQ FAILED] ${req.url()} - ${req.failure().errorText}`));
  page.on("response", res => {
    if (res.status() >= 400) {
      console.log(`[HTTP ERROR] ${res.status()} on ${res.url()}`);
    }
  });

  console.log("Navigating to http://localhost:8080/login...");
  await page.goto("http://localhost:8080/login", { waitUntil: "networkidle" });
  await page.screenshot({ path: "debug_login_loaded.png" });

  console.log("Filling form...");
  await page.fill('input[type="email"]', "admin@portfolio.fr");
  await page.fill('input[type="password"]', "admin");
  await page.screenshot({ path: "debug_login_filled.png" });

  console.log("Clicking submit...");
  await page.click('button[type="submit"]');
  
  try {
    await page.waitForNavigation({ waitUntil: "networkidle", timeout: 5000 });
    console.log("Navigation finished. Current URL:", page.url());
  } catch (err) {
    console.log("Navigation timeout or error:", err.message);
  }

  await page.screenshot({ path: "debug_login_after_submit.png" });
  await browser.close();
}

debug();
