import React, { useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [scrapeData, setScrapeData] = useState(null);

  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    const newMessage = { role: 'user', content: input };
    setMessages([...messages, newMessage]);

    try {
      const response = await openai.createChatCompletion({
        model,
        messages: [...messages, newMessage],
      });

      const botMessage = response.data.choices[0].message;
      setMessages([...messages, newMessage, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  const handleScrape = async () => {
    if (!scrapeUrl.trim()) return;
    setLoading(true);

    try {
      const response = await fetch(`/api/scrape?url=${encodeURIComponent(scrapeUrl)}`);
      const data = await response.json();
      setScrapeData(data);
    } catch (error) {
      console.error('Error scraping URL:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-interface">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className="controls">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
      <div className="settings">
        <label htmlFor="model">Select Model:</label>
        <select
          id="model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="gpt-3.5-turbo">ChatGPT 3.5 Turbo</option>
          <option value="text-davinci-003">Davinci</option>
        </select>
      </div>
      <div className="scrape-controls">
        <input
          type="text"
          value={scrapeUrl}
          onChange={(e) => setScrapeUrl(e.target.value)}
          placeholder="Enter URL to scrape..."
        />
        <button onClick={handleScrape} disabled={loading}>
          {loading ? 'Scraping...' : 'Scrape'}
        </button>
      </div>
      {scrapeData && (
        <div className="scrape-results">
          <h2>Scrape Results:</h2>
          <pre>{JSON.stringify(scrapeData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default ChatInterface;