const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // TODO read article url from stdin
  await page.goto(
    'http://www.foxnews.com/tech/2018/07/11/blade-runner-becomes-reality-two-flying-taxi-startups-get-pentagon-funding.html',
    {
      waitUntil: 'domcontentloaded',
    },
  );

  const article = await page.$eval('.main-content .article-wrap', el => {
    // TODO handle edge cases
    return {
      title: el.querySelector('h1').innerText,
      author: el.querySelector('.author-byline span').innerText,
      date: el.querySelector('.article-date time').getAttribute('data-time-published'),
      body: el.querySelector('.article-body').innerHTML,
    };
  });

  console.log(JSON.stringify(article, 0, 2));
  await browser.close();
})();
