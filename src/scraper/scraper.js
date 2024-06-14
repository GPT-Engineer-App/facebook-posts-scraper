const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function scrapeFacebookPage() {
  let browser;
  try {
    console.log('Launching browser...');
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    console.log('Navigating to Facebook page...');
    await page.goto('https://m.facebook.com/MaxValUFiji/', { waitUntil: 'networkidle2' });

    // Scroll down to load more posts
    console.log('Scrolling to load more posts...');
    await autoScroll(page);

    // Extract the flyers and images
    console.log('Extracting data from the page...');
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

    console.log('Data extraction complete.');
    return data;
  } catch (error) {
    console.error('Error scraping Facebook page:', error);
    return [];
  } finally {
    if (browser) {
      console.log('Closing browser...');
      await browser.close();
    }
  }
}

// Helper function to auto-scroll the page
async function autoScroll(page) {
  try {
    await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  } catch (error) {
    console.error('Error during auto-scroll:', error);
  }
}

module.exports = { scrapeFacebookPage };