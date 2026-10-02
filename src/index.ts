import { load } from "cheerio";
import * as fs from "node:fs/promises";

const URL =
  "https://books.toscrape.com/catalogue/category/books/mystery_3/index.html";

try {
  const res = await fetch(URL);
  const text = await res.text();
  const $ = load(text);
  const elements = $("article");
  fs.writeFile("mystery_books.txt", "utf8");

  elements.each((i, element) => {
    const title = $(element).find("h3").text();
    const url = $(element).find("a").attr("href");
    fs.appendFile("mystery_books.txt", `${title} ${url} \n`);
  });
  console.log("mystery_books.txt was created");
} catch (err) {
  console.error(err, "err");
}
