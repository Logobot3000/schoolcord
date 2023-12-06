const express = require('express');
const app = express();
const port = 3000;

const dbtool = require('./dbtool/dbtool');
const db = new dbtool('./');

let stored_messages = [];

db.createTable('messages', {
    id: 'auto_increment', display_name: 'string', text: 'string'
});

app.use(express.static('./public'));

app.get('/', (req, res) => {
    if (req.query.message) {
        const text = req.query.message;
        const display_name = req.query.displayname
        db.insertIntoTable('messages', {display_name: display_name, text: text});
        const highestId = db
            .select('messages', () => true)
            .reverse()
            [0].id;
        const filterId = highestId - 100;

        if (filterId >= 0) {
            db.removeFromTable('messages', (data) => data.id < filterId);
        }

        stored_messages = db.select('messages', () => true);
        res.redirect('/');
    }
    console.log(stored_messages);
    res.sendFile(`${__dirname}/pages/index.html`);
});

app.get('/api/messages', (req, res) => {
   res.json({stored_messages: stored_messages});
});

app.get('/about', (req, res) => {
    res.sendFile(`${__dirname}/pages/about.html`);
});

app.listen(port);