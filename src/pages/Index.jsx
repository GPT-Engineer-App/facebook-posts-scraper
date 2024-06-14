import React, { useEffect, useState } from 'react';

const Index = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/scrape')
      .then(response => response.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold underline mb-4">Welcome to the Grocery Scraper</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : data.length > 0 ? (
          data.map((item, index) => (
            <div key={index} className="border p-4 rounded shadow">
              <img src={item.src} alt={item.alt} className="w-full h-48 object-cover rounded" />
              <div className="mt-2">
                <p className="font-semibold">{item.alt}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No data available. Please try again later.</p>
        )}
      </div>
    </div>
  );
};

export default Index;