const express = require('express');
const scraper = require('./scraper/scraper');

const app = express();
const port = 3000;

app.get('/api/scrape', async (req, res) => {
  try {
    const data = await scraper.scrapeFacebookPage();
    res.json(data);
  } catch (error) {
    console.error('Error scraping data:', error);
    res.status(500).json({ error: 'Failed to scrape data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});