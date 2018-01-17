const express = require('express');



let v3Router = express.Router();

v3Router.get('/first', (req, res) => {
  res.send('Home');
});

module.exports = v3Router ;
