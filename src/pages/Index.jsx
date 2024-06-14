import React, { useEffect, useState } from 'react';

const Index = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/api/scrape')
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold underline mb-4">Welcome to the Grocery Scraper</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div key={index} className="border p-4 rounded shadow">
            <img src={item.src} alt={item.alt} className="w-full h-auto" />
            <p className="mt-2">{item.alt}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;