const express = require('express');
const bodyParser = require('body-parser');
const eapp = express();
const fs = require('fs');

const {app, BrowserWindow} = require('electron');
const path = require('path');
const url = require('url');

const PORT = 19991;

let win;

function createWindow() {
  win = new BrowserWindow({width: 800, height: 600});

  win.loadURL(`http://localhost:${PORT}`);
  win.focus();

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', () => {
  startServer();
});
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

function startServer() {
  const SYNC = '/sync';

  eapp.use(bodyParser.json());
  eapp.use(express.static(__dirname + '/client/dist'));

  eapp.get(SYNC, (req, res) => {
    const file = fs.readFileSync(__dirname + '/data.json', 'utf8');
    res.write(file);
    res.end();
  });

  eapp.post(SYNC, (req, res) => {
    fs.writeFile(__dirname + '/data.json', JSON.stringify(req.body), 'utf8', () => {
      res.write(JSON.stringify({status: 'ok'}));
      res.end();
    });
  });

  eapp.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    createWindow();
  });
}