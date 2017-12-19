'use strict';

const express = require('express');
const cores = require('cors');
const pg = require('pg');

const app = express();
const PORT = process.env.PORT;

const client = new pg.Client(process.env.CLIENT_URL);
client.connect();
client.on('error', err => console.error(err));

app.use(cors());

app.get('/', (req, res) => res.send('Testing 1, 2, 3'));

app.get('/api/v1/books', (req, res) => {
    client.query('SELECT book_id title author image_url FROM books;')
      .then(results => res.send(results.rows))
      .catch(err => {
        console.error(err)
        res.status(400).send('something went wrong, Bozo')
      })
  })

app.get('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
