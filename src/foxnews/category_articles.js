const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const len = process.env.LEN || 100;
  const timeout = process.env.TIMEOUT || 15000;

  // TODO read category url from stdin
  await page.goto('http://www.foxnews.com/category/tech/topics/innovation.html', {
    waitUntil: 'domcontentloaded',
  });

  try {
    await page.waitForFunction(
      len => {
        document.querySelector('.js-load-more a').click();
        return document.querySelectorAll('.js-infinite-list .article .title a').length > len;
      },
      {timeout},
      len,
    );
  } catch (e) {
    console.log(e);
  }

  const articles = new Set();
  const titles = await page.$$('.js-infinite-list .article .title');
  for (const title of titles) {
    const href = await title.$eval('a', el => el.href);
    articles.add(href);
  }

  console.log(JSON.stringify(Array.from(articles), 0, 2));
  await browser.close();
})();
