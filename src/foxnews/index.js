const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto('http://www.foxnews.com', {
    waitUntil: 'domcontentloaded',
  });

  const categories = [];
  const navs = await page.$$('.site-footer nav');

  // TODO exclude non-category navs
  for (const nav of navs) {
    const name = await nav.$eval('.nav-title', el => el.innerText);
    const navItems = await nav.$$('.nav-item');
    const category = {name};

    for (const navItem of navItems) {
      const sub = await navItem.$eval('a', el => [el.innerText, el.href]);
      category.subCategory = sub[0];
      category.href = sub[1];
      categories.push(category);
    }
  }

  console.log(JSON.stringify(categories, 0, 2));
  await browser.close();
})();
