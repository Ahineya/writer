const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const fs = require('fs');

const PORT = 3000;

const SYNC = '/sync';

app.use(bodyParser.json());
app.use(express.static('client/dist'));

app.get(SYNC, (req, res) => {
  const file = fs.readFileSync(__dirname + '/data.json', 'utf8');
  res.write(file);
  res.end();
});

app.post(SYNC, (req, res) => {
  fs.writeFile(__dirname + '/data.json', JSON.stringify(req.body), 'utf8', () => {
    res.write(JSON.stringify({status: 'ok'}));
    res.end();
  });
});

app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
