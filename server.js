'use strict'

// Application Dependencies
const express = require('express');
const cors = require('cors');
const pg = require('pg');
const bodyParser = require('body-parser');

// App Setup
const app = express();
const PORT = process.env.PORT;
const DATABASE_URL = process.env.DATABASE_URL;
const CLIENT_URL = process.env.CLIENT_URL;

// DATABASE Setup
const client = new pg.Client(DATABASE_URL);
client.connect()
  .then( () => console.log('yay we are connected to database'))
  .catch( error => console.error('your error here ==> ', error.stack  ))

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/api/v1/books', (req, res) => {
  client.query('SELECT book_id, title, author, image_url, isbn FROM books;')
    .then(results => res.send(results.rows))
    .catch(console.error)
});

app.get('/api/v1/books/:id', (req, res) => {
  client.query(`SELECT * FROM books WHERE book_id=$1;`, [req.params.id])
    .then(result => res.send(result.rows))
    .catch(console.error)
});

app.post('/api/v1/books', (req, res) => {
  client.query(`INSERT INTO books(title, author, image_url, isbn, description)
  VALUES($1, $2, $3, $4, $5);`,
    [req.body.title, req.body.author, req.body.image_url, req.body.isbn, req.body.description])
    .then(result => res.send(result))
    .catch(console.error)
});

app.put('/api/v1/books/:id', (req, res) => {
  client.query(`UPDATE books
                SET title=$1, author=$2, image_url=$3, isbn=$4, description=$5
                WHERE book_id=$6;`,  [req.body.title, req.body.author, req.body.image_url, req.body.isbn, req.body.description, req.params.id])
    .then(() => res.sendStatus(204))
    .catch(err => {
      console.error(err)
      res.status(400).sendStatus('Bad update request, book does not exist')
    })
});

app.delete('/api/v1/books/:id', (req, res) => {
  client.query(`DELETE FROM books WHERE book_id=$1;`, [req.params.id])
    .then(() => res.sendStatus(204))
    .catch(err => {
      console.error(err)
      res.status(400).sendStatus('Bad request, book does not exist')
    })
});

app.get('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
