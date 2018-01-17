const express = require('express');



let v3Router = express.Router();
///v3/investments
v3Router.get('/investments', (req, res) => {
  res.send('Home');
});

//get all investments for a specific coin
v3Router.get('/investments/:coinName', (req, res) => {
  res.send('Home');
});

//get a investment for a coinName lol.com/BTC/1204
v3Router.get('/investments/:coinName/:id', (req, res) => {
  res.send('Home');
});

//create a investment; needs a query
//{}
  v3Router.post('/investment', (req, res) => {
    res.send('Home');
  });

//update a investment
v3Router.put('/investments/:coinName/:id', (req, res) => {
  res.send('Home');
});

//del a investment
v3Router.delete('/investments/:coinName/:id', (req, res) => {
  res.send('Home');
});

//delete all investments
v3Router.delete('/investments', (req, res) => {
  res.send('Home');
});
module.exports = v3Router ;
