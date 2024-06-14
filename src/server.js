const express = require('express');
const scraper = require('./scraper/scraper');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());

app.post('/api/scrape', async (req, res) => {
  const { url } = req.body;
  try {
    console.log('Scraping data from URL:', url);
    const data = await scraper.scrapeFacebookPage(url);
    if (data.length === 0) {
      throw new Error('No data scraped');
    }
    res.json(data);
  } catch (error) {
    console.error('Error scraping data:', error);
    res.status(500).json({ error: 'Failed to scrape data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});