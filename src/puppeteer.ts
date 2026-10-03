import puppeteer from "puppeteer";

export const visitUrl = async (URL: string) => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  await page.goto(URL);

  await browser.close();
};
