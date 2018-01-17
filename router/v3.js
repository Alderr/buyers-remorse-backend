const express = require('express');


const { BCH_Investments } = require('../models/Bitcoin_Cash_Investment');
const { ETH_Investments } = require('../models/Ethereum_Investment');
const { XRP_Investments } = require('../models/Ripple_Investment');
const { BTC_Investments } = require('../models/Bitcoin_Investment');

let v3Router = express.Router();
///v3/investments

function isThereDate(date, object) {
  if (date === '' || date === undefined || date === null) {
    return false;
  }
  else {
    object.date = date;
  }

}

function isTherePreviousValue(value , object) {
  if (value === '' || value === undefined || value === null) {
    //make the call to the api here or dummy data
    let max = 15000;
    let min = 1000

    object.previousValue = (Math.random() * (max - min + 1) + min).toFixed(2);
  }

  else {
    object.previousValue = value;
  }
}

function addToETH(response, investmentAmount, previousValue, date) {

  let a_ETH_Investment = {
    investmentAmount: 100
  };

  isThereDate(date, a_ETH_Investment);
  isTherePreviousValue(previousValue, a_ETH_Investment);

    //create one

  ETH_Investments.create(a_ETH_Investment)
  .then((data) => {
    console.log(data);
    response.status(202).send(data);
  })
  .catch((err) => {
    console.log(err);
    res.status(404).send(err.message);
  });

  //return response.json(a_ETH_Investment);
}

function addToBTC(response, investmentAmount, previousValue, date) {

  let a_BTC_Investment = {
    investmentAmount: 100
  };

  isThereDate(date, a_BTC_Investment);
  isTherePreviousValue(previousValue, a_BTC_Investment);

    //create one

  BTC_Investments.create(a_BTC_Investment)
  .then((data) => {
    console.log(data);
    response.status(202).send(data);
  })
  .catch((err) => {
    console.log(err);
    res.status(404).send(err.message);
  });

  //return response.json(a_BTC_Investment);
}

function addToXRP(response, investmentAmount, previousValue, date) {

  let a_XRP_Investment = {
    investmentAmount: 100
  };

  isThereDate(date, a_XRP_Investment);
  isTherePreviousValue(previousValue, a_XRP_Investment);

    //create one

  XRP_Investments.create(a_XRP_Investment)
  .then((data) => {
    console.log(data);
    response.status(202).send(data);
  })
  .catch((err) => {
    console.log(err);
    res.status(404).send(err.message);
  });

  //return response.json(a_XRP_Investment);
}

function addToBCH(response, investmentAmount, previousValue, date) {

  let a_BCH_Investment = {
    investmentAmount: 100
  };

  isThereDate(date, a_BCH_Investment);
  isTherePreviousValue(previousValue, a_BCH_Investment);

    //create one

  BCH_Investments.create(a_BCH_Investment)
  .then((data) => {
    console.log(data);
    response.status(202).send(data);
  })
  .catch((err) => {
    console.log(err);
    res.status(404).send(err.message);
  });

  //return response.json(a_BCH_Investment);
}


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
    let requiredQueryNames = ['coinName', 'investmentAmount'];

    for (name in requiredQueryNames){
      if (!req.body[requiredQueryNames[name]]) {
        return res.status(404).send('Missing query.');
      }
  }

  let { coinName, investmentAmount, date, previousValue } = req.body;

  //decide whether to add to ETH, BTC, XRP, BCH
  switch(coinName) {
    case 'XRP':
      addToXRP(res, investmentAmount, previousValue, date);
      break;
    case 'ETH':
      addToETH(res, investmentAmount, previousValue, date);
      break;
    case 'BCH':
      addToBCH(res, investmentAmount, previousValue, date);
      break;
    case 'BTC':
      addToBTC(res, investmentAmount, previousValue, date);
      break;
  }

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
