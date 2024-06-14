const express = require('express');
const scraper = require('./scraper/scraper');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.get('/api/scrape', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    console.log(`Scraping data from ${url}...`);
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