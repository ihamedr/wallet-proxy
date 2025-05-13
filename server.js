const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// آدرس اسکریپت ثبت کیف‌پول
const WALLET_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbykpm8j_Xz2wcB94LuM0ExWEACkbRbYyqL5rHW-KB432zlRxFoGXA8G8S8XBkCPpKhE/exec";

// آدرس اسکریپت ثبت رفرال (جدید)
const REFERRAL_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbytrE5ojdhZy-hnEr8dHQDUoy9zU9vAXDApQDYknq1HPjX50r0O8PPY8qI3qk0zDdNC9w/exec";

// ثبت کیف‌پول
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

// ثبت رفرال
app.post('/save-referral', async (req, res) => {
  const { user_id, username, referrer_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'Missing user_id' });
  }

  try {
    const response = await fetch(REFERRAL_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id, username, referrer_id }),
    });

    const text = await response.text();
    res.status(200).json({ message: text });
  } catch (error) {
    console.error('Error forwarding to Google Apps Script (referral):', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on ${PORT}`);
});