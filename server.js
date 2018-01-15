require('dotenv').config();
const rp = require('request-promise');

// init project
var express = require('express');
var app = express();

const API_KEY = process.env.API_KEY;

app.get("/", function (request, response) {
  response.send('Home');
});

app.get("/v1/profit", function (request, response) {

    let requiredQueryNames = ['coinName', 'investmentAmount', 'date'];

    for (name in requiredQueryNames){
    if (!request.query[requiredQueryNames[name]]) {
      return response.status(404).send('Missing query.');
    }
  }

  var { coinName, investmentAmount, date } = request.query;

  return response.json({ coinName, investmentAmount, date});

});

app.get("/v2/profit", function (request, response) {

  let requiredQueryNames = ['coinName', 'investmentAmount', 'date'];

    for (name in requiredQueryNames){
    if (!request.query[requiredQueryNames[name]]) {
      return response.status(404).send('Missing query.');
    }
  }

  var { coinName, investmentAmount, date } = request.query;

  res.status(204).end();
});

app.get('/coinNames', (req, res) => {
  let coinNames = {};

    var options = {
      method: 'GET',
      uri: 'https://rest.coinapi.io/v1/assets',
      headers: {
          'User-Agent': 'Request-Promise',
          'X-CoinAPI-Key': API_KEY
      },
      json: true // Automatically parses the JSON string in the response
    };

  rp(options)
    .then(function (data) {
        data.forEach( (coin) => {

            coinNames[coin.name] = {
              start: coin.data_start,
              end: coin.data_end
            }
            //console.log(`${coin.name} ${coin.type_is_crypto==1 ? 'is cryptocurrency.' : 'is not a coin.'}`);
        });
    })
    .then( () => {
      res.json(coinNames);
  })
    .catch(function (err) {
        console.log(err);
    });

});

app.use('*', function (req, res) {
    res.status(404).json({ message: 'Not Found' });
});
// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

module.exports = app;
