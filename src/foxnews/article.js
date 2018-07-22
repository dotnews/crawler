const puppeteer = require('puppeteer');
const config = require('../config');
const stdIn = require('fs').readFileSync(0);

(async () => {
  const browser = await puppeteer.launch(config);
  const page = await browser.newPage();
  const article = JSON.parse(stdIn.toString());
  let content;

  await page.goto(article.href, {
    waitUntil: 'domcontentloaded',
  });

  await page.addScriptTag({url: 'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js'});

  if (isVideo(article)) {
    try {
      await hasVideoMeta(page);
    } finally {
      content = await parseVideo(page);
    }
  } else {
    content = await parseText(page);
  }

  Object.assign(article, content);
  console.log(JSON.stringify(article, 0, 2));
  await page.close();
  await browser.close();
})();

const isVideo = article => {
  return article.href.includes('//video.foxnews.com/');
};

const parseText = page => {
  return page.$eval('.main-content .article-wrap', el => {
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
};

const parseVideo = page => {
  return page.$eval('.video-meta', el => {
    const title = el.querySelector('h1');
    const p = el.querySelector('p');
    return {
      title: title && title.innerText,
      date: p && moment(p.innerText.trim(), 'MMM. DD, YYYY - H:mm').toJSON(),
    };
  });
};

const hasVideoMeta = page => {
  return page.waitForFunction(
    () => {
      const p = document.querySelector('.video-meta p');
      return p && p.innerText;
    },
    {timeout: 3000},
  );
};
