const puppeteer = require('puppeteer');
const config = require('../config');
const stdIn = require('fs').readFileSync(0);

(async () => {
  const browser = await puppeteer.launch(config);
  const page = await browser.newPage();
  const article = JSON.parse(stdIn.toString());

  await page.goto(article.href, {
    waitUntil: 'domcontentloaded',
  });

  const content = await page.$eval('.main-content .article-wrap', el => {
    const title = el.querySelector('h1');
    const author = el.querySelector('.author-byline [rel=author]');
    const date = el.querySelector('.article-date time');
    const body = el.querySelector('.article-body');

    return {
      title: title && title.innerText,
      author: author && author.innerText,
      authorHref: author && author.href,
      date: date && date.getAttribute('data-time-published'),
      body: body && body.innerHTML,
    };
  });

  Object.assign(article, content);
  console.log(JSON.stringify(article, 0, 2));
  await browser.close();
})();
