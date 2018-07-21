const puppeteer = require('puppeteer');
const config = require('../config');

(async () => {
  const browser = await puppeteer.launch(config);
  const page = await browser.newPage();

  await page.goto('http://www.foxnews.com', {
    waitUntil: 'domcontentloaded',
  });

  const categories = [];
  const navs = await page.$$('.site-footer nav');
  const regex = /foxnews.com\/(category\/|politics\/|auto.html|food-drink.html|travel.html)/;

  for (const nav of navs) {
    let cat;
    try {
      cat = await nav.$eval('.nav-title a', el => [el.innerText, el.href]);
    } catch (_) {
      continue;
    }

    const navItems = await nav.$$('.nav-item');
    for (const navItem of navItems) {
      const sub = await navItem.$eval('a', el => [el.innerText, el.href]);

      if (!regex.test(sub[1])) {
        continue;
      }

      categories.push({
        name: cat[0],
        href: cat[1],
        subCategory: sub[0],
        subCategoryHref: sub[1],
      });
    }
  }

  console.log(JSON.stringify(categories, 0, 2));
  await browser.close();
})();
