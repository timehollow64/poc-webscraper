import puppeteer, { Browser, Page } from "puppeteer";
export const articles: { title: string; url: string }[] = [];

const URL =
  "https://books.toscrape.com/catalogue/category/books/mystery_3/index.html";

const initScraper = async (): Promise<{ page: Page; browser: Browser }> => {
  const browser = await puppeteer.launch({ headless: false });

  const page = await browser.newPage();

  return { page, browser };
};

const navigateToPage = async (page: Page): Promise<void> => {
  await page.goto(URL);
};

const navigateToNextPage = async (page: Page): Promise<void> => {
  const nextBtn = await page.$(".next a");
  if (nextBtn) {
    await page.click(".next a");
  }
};
const scrapArticles = async (): Promise<void> => {
  const { page, browser } = await initScraper();
  const scrapPage = async (): Promise<void> => {
    const bookCount = await page.$$eval("h3 > a", (links) => links.length);

    for (let i = 0; i < bookCount; i++) {
      const books = await page.$$("h3 > a");
      await Promise.allSettled([page.waitForNavigation(), books[i].click()]);

      const title = await page.$eval(
        "h1",
        (header) => header.textContent ?? "",
      );

      articles.push({ title, url: page.url() });
      await page.goBack();
    }
  };
  const findPager = async (): Promise<string> => {
    const pager = await page.$eval(
      ".pager .current",
      (el) => el.textContent?.trim() ?? "",
    );
    return pager;
  };

  try {
    await navigateToPage(page);
    const parsedPager = await findPager().then((pager: string) => {
      return parseFloat(pager.slice(-1)) ?? 0;
    });
    for (let i = 0; i < parsedPager; i++) {
      if (parsedPager > 0) {
        await scrapPage();

        await navigateToNextPage(page);
      } else {
        await browser.close();
      }
    }
  } catch (err) {
    console.error(err);
    await browser.close();
  }
};

void scrapArticles();
