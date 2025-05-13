const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const bodyParser = require('body-parser');
const querystring = require('querystring');

const app = express();
app.use(cors());
app.use(bodyParser.json()); // برای JSON مثل save-wallet
app.use(bodyParser.urlencoded({ extended: false })); // برای form-urlencoded مثل save-referral

const PORT = 3000;

const WALLET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbykpm8j_Xz2wcB94LuM0ExWEACkbRbYyqL5rHW-KB432zlRxFoGXA8G8S8XBkCPpKhE/exec";
const REFERRAL_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyhJNvv21l2LQEDZ_ohxeWa0bUQqNR0ahq7a4HGl4OMuYwyyELaAxggSLjy0qT5ed24xw/exec";

// ------------------------------
// ثبت کیف‌پول (JSON)
// ------------------------------
app.post('/save-wallet', async (req, res) => {
  const { telegramId, walletAddress } = req.body;

  if (!telegramId || !walletAddress) {
    return res.status(400).json({ error: 'Missing telegramId or walletAddress' });
  }

  try {
    const response = await fetch(WALLET_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramId, walletAddress }),
    });

    const text = await response.text();
    res.status(200).json({ message: text });
  } catch (error) {
    console.error('Error forwarding to Google Apps Script (wallet):', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ------------------------------
// ثبت رفرال (form-urlencoded)
// ------------------------------
app.post('/save-referral', async (req, res) => {
  const { user_id, username, referrer_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  const formBody = querystring.stringify({ user_id, username, referrer_id });

  try {
    const response = await fetch(REFERRAL_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formBody,
    });

    const text = await response.text();
    res.status(200).json({ message: text });
  } catch (error) {
    console.error('Error forwarding to Google Apps Script (referral):', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});