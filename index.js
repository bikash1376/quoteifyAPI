const express = require('express');
const fs = require('fs/promises');

const app = express();
const port = 3000;
const quotesFilePath = './quotes.json';

app.get('/', (req, res) => {
    res.redirect('/quotes/random');
  });
  
app.get('/quotes', async (req, res) => {
  try {
    const data = await fs.readFile(quotesFilePath, 'utf8');
    const quotes = JSON.parse(data);
    const formattedQuotes = quotes.map(quote => JSON.stringify(quote, null, 2)).join('\n');
    res.set('Content-Type', 'application/json');
    res.send(formattedQuotes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/quotes/random', async (req, res) => {
  try {
    const data = await fs.readFile(quotesFilePath, 'utf8');
    const quotes = JSON.parse(data);
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    res.json(randomQuote);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/quotes/:id', async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    const data = await fs.readFile(quotesFilePath, 'utf8');
    const quotes = JSON.parse(data);
    const quote = quotes.find(q => q.id === id);

    if (quote) {
      res.json(quote);
    } else {
      res.status(404).send('Quote not found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
