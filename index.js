// index.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/wordlist', async (req, res) => {
  try {
    const response = await fetch('https://introcs.cs.princeton.edu/java/data/wordlist.txt');
    const text = await response.text();
    res.send(text);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch word list' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
