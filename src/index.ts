import { createServer } from "http";
import { articles } from "./scraper/index.js";
const hostname = "127.0.0.1";

const server = createServer((req, res) => {
  const { method } = req;
  const url = new URL(req.url ?? "/", `http://${hostname}`);
  const search = url.searchParams.get("title") ?? "";

  req.on("error", (err) => {
    console.error(err);
    res.statusCode = 500;
    res.end();
  });

  if (method !== "GET" || url.pathname !== "/articles") {
    res.statusCode = 404;
    res.end();
    return;
  }

  if (search === "") {
    res.write(JSON.stringify(articles));
    res.end();
    return;
  }

  const el = articles.find((book) => book.title === search);
  if (el) {
    res.write(JSON.stringify(el));
  } else {
    res.statusCode = 404;
  }
  res.end();
});

server.listen({ port: 3001, host: hostname });
