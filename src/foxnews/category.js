const puppeteer = require('puppeteer');
const stdIn = require('fs').readFileSync(0);

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const len = process.env.LEN || 20;
  const timeout = process.env.TIMEOUT || 15000;
  const category = JSON.parse(stdIn.toString());

  await page.goto(category.subCategoryHref, {
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
    console.error(e);
  }

  const articles = new Set();
  const titles = await page.$$('.js-infinite-list .article .title');
  for (const title of titles) {
    const href = await title.$eval('a', el => el.href);
    articles.add({
      href,
      category: category.name,
      categoryHref: category.href,
      subCategory: category.subCategory,
      subCategoryHref: category.subCategoryHref,
    });
  }

  console.log(JSON.stringify(Array.from(articles), 0, 2));
  await browser.close();
})();
