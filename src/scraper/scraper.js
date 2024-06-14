const puppeteer = require('puppeteer');

async function scrapeFacebookPage() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://m.facebook.com/MaxValUFiji/');

  // Wait for the posts to load
  await page.waitForSelector('div.story_body_container');

  // Extract the flyers and images
  const data = await page.evaluate(() => {
    const posts = document.querySelectorAll('div.story_body_container');
    const results = [];

    posts.forEach(post => {
      const images = post.querySelectorAll('img');
      images.forEach(img => {
        results.push({
          src: img.src,
          alt: img.alt || 'No description'
        });
      });
    });

    return results;
  });

  await browser.close();
  return data;
}

scrapeFacebookPage().then(data => console.log(data)).catch(console.error);