const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://www.foxnews.com/');

  // await page.addScriptTag({url: 'https://code.jquery.com/jquery-3.2.1.min.js'});

  const categoryUrls = await page.evaluate(() => {
    return window
      .$('.site-footer nav:first .nav-item a')
      .map((i, el) => el.href)
      .toArray();
  });

  const categories = [];

  for (let categoryUrl of categoryUrls) {
    await page.goto(categoryUrl);

    const articles = await page.evaluate(() => {
      return window
        .$('.js-infinite-list article')
        .map((i, el) => {
          return {
            title: $(el)
              .find('h2.title')
              .text(),

            href: $(el)
              .find('h2.title a')
              .attr('href'),
          };
        })
        .toArray();
    });

    categories.push({
      category: categoryUrl,
      articles,
    });
  }

  for (let category of categories) {
    for (let article of category.articles) {
      await page.goto(`http://www.foxnews.com/${article.href}`);

      article.body = await page.evaluate(() => {
        return window
          .$('.main-content article:first')
          .find('.article-body')
          .html();
      });
    }
  }

  console.log(JSON.stringify(categories, 0, 2));
  await browser.close();
})();
