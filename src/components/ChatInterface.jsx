import React, { useState } from 'react';
import { Configuration, OpenAIApi } from 'openai';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [model, setModel] = useState('gpt-3.5-turbo');
  const [scrapeUrl, setScrapeUrl] = useState('');

  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { role: 'user', content: input };
    setMessages([...messages, newMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await openai.createChatCompletion({
        model: model,
        messages: [...messages, newMessage],
      });

      const botMessage = response.data.choices[0].message;
      setMessages([...messages, newMessage, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScrape = async () => {
    if (!scrapeUrl.trim()) return;

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: scrapeUrl }),
      });

      const data = await response.json();
      console.log('Scraped data:', data);
    } catch (error) {
      console.error('Error scraping URL:', error);
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
          placeholder="Type a message..."
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
      <div className="settings">
        <label>
          Model:
          <select value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="gpt-3.5-turbo">ChatGPT 3.5 Turbo</option>
            <option value="gpt-3">GPT-3</option>
          </select>
        </label>
        <label>
          Scrape URL:
          <input
            type="text"
            value={scrapeUrl}
            onChange={(e) => setScrapeUrl(e.target.value)}
            placeholder="Enter URL to scrape..."
          />
          <button onClick={handleScrape}>Scrape</button>
        </label>
      </div>
    </div>
  );
};

export default ChatInterface;