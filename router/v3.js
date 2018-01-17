const express = require('express');


const { BCH_Investments } = require('../models/Bitcoin_Cash_Investment');
const { ETH_Investments } = require('../models/Ethereum_Investment');
const { XRP_Investments } = require('../models/Ripple_Investment');
const { BTC_Investments } = require('../models/Bitcoin_Investment');

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
    let requiredQueryNames = ['coinName', 'investmentAmount', 'date'];

    for (name in requiredQueryNames){
      //not in requiredQueryNames tell to get come back latah
        if (!request.query[requiredQueryNames[name]]) {
          return response.status(404).send('Missing query.');
        }
    }

    var { coinName, investmentAmount, date } = request.query;

    res.json('Home');
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
