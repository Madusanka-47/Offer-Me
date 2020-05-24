const express = require('express'),
  bodyParser = require('body-parser');
const path = require('path');
const api = require('./api/api');
const mongoose = require('mongoose');
const changeSteamWatcher = require('./api/services/ChangeSteamWatcher');


mongoose.connect('mongodb+srv://dumalk:dumalk@cluster0-yx3nh.mongodb.net/OfferMe-scraphub?replicaSet=cluster0-shard-00-00-yx3nh.mongodb.net:27017&retryWrites=true&w=majority');
const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', api)
// api(app)

module.exports = app;
var connection = new Promise((resolve, rejected) => {
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'Connection Error:'));
  db.once('open', () => {
    app.listen(9000, () => {
      console.log('Node server running on port 9000');
      resolve(db)
    });
  });
})

connection.then((result) => {
  changeSteamWatcher(result)
})
