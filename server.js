// server.js
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbwB-lfTBIXrqTqJH1y-2IAHHO7px0WsOmomDQAvQyGBd-8RyVKb56HD-is_krwRb5gG/exec";

app.post('/save-wallet', async (req, res) => {
  const { telegramId, walletAddress } = req.body;

  if (!telegramId || !walletAddress) {
    return res.status(400).json({ error: 'Missing telegramId or walletAddress' });
  }

  try {
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramId, walletAddress }),
    });

    const text = await response.text();
    res.status(200).json({ message: text });
  } catch (error) {
    console.error('Error forwarding to Google Apps Script:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});