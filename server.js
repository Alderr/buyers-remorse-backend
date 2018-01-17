require('dotenv').config();

const rp = require('request-promise');
const cors = require('cors');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var express = require('express');


var app = express();

const API_KEY = process.env.API_KEY;
const DATABASE_URL = process.env.DATABASE_URL;
const PORT = process.env.PORT;

const v3Router = require('./router/v3');

app.use(cors());
app.use('/v3', v3Router);

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

//functions for v2
let getCurrentRatePromise = function (coinName, investmentAmount , date ) {

  var currentRateOptions = {
    method: 'GET',
    uri: 'https://rest.coinapi.io/v1/exchangerate/BTC/USD',
    headers: {
        'User-Agent': 'Request-Promise',
        'X-CoinAPI-Key': API_KEY
    },
    json: true // Automatically parses the JSON string in the response
  };

  return rp(currentRateOptions)
    .then(function (data) {
          return Promise.resolve(Math.trunc(data.rate));
    })
  .catch(function (err) {
        console.log(err.message);
        return Promise.reject(new Error(err));
    });

};

let getHistoryRatePromise = function (coinName, investmentAmount , date ) {
    var historyRateOptions = {
    method: 'GET',
    uri: 'https://rest.coinapi.io/v1/trades/BITSTAMP_SPOT_BTC_USD/history?time_start=2016-01-01T00:00:00&limit=1',
    headers: {
        'User-Agent': 'Request-Promise',
        'X-CoinAPI-Key': API_KEY
    },
    json: true // Automatically parses the JSON string in the response
  };

  return rp(historyRateOptions)
    .then(function (data) {
          return Promise.resolve(Math.trunc(data[0].price));
    })
  .catch(function (err) {
        console.log(err.message);
        return Promise.reject(new Error(err));
    });
  };

let calculateProfit = function (beginningPrice, endPrice, investmentAmount){
  return Math.trunc(endPrice/beginningPrice * investmentAmount);
}

let calculatePercentage = function (beginningPrice, endPrice){
  return Math.trunc(endPrice/beginningPrice * 100) + '%';
}

app.get("/v2/profit", function (request, response) {

    let requiredQueryNames = ['coinName', 'investmentAmount', 'date'];

    for (name in requiredQueryNames){
      //not in requiredQueryNames tell to get come back latah
        if (!request.query[requiredQueryNames[name]]) {
          return response.status(404).send('Missing query.');
        }
    }

    var { coinName, investmentAmount, date } = request.query;


    Promise.all([getHistoryRatePromise(), getCurrentRatePromise()])
      .then((values) => {
        console.log(values);
        let [ beforeWorth, afterWorth ] = values;
        let grossProfit = calculateProfit(beforeWorth, afterWorth, investmentAmount);
        let percentIncrease = calculatePercentage(beforeWorth, afterWorth);

        response.json({profit: grossProfit, investment: investmentAmount, percentageOfIncrease: percentIncrease});
      })
      .catch((err) => {
        response.send(err.message);
      });


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

app.get('/symbols', (req, res) => {

      var options = {
        method: 'GET',
        uri: 'https://rest.coinapi.io/v1/symbols',
        headers: {
            'User-Agent': 'Request-Promise',
            'X-CoinAPI-Key': API_KEY
        },
        json: true // Automatically parses the JSON string in the response
      };


    rp(options)
      .then(function (data) {
          //console.log(data);
           return res.json(data);
      })
      .catch(function (err) {
          console.log(err);
      });

});

app.get('/symbols/:coinName', (req, res) => {
    let coinName = req.params.coinName;

      var options = {
        method: 'GET',
        uri: 'https://rest.coinapi.io/v1/symbols',
        headers: {
            'User-Agent': 'Request-Promise',
            'X-CoinAPI-Key': API_KEY
        },
        json: true // Automatically parses the JSON string in the response
      };

    let Ids = [];
    rp(options)
      .then(function (data) {
          data.forEach( (symbol) => {

            if(symbol.asset_id_base === coinName && symbol.asset_id_quote === 'USD')
            {
              console.log(symbol.symbol_id);
              Ids.push({ id: symbol.symbol_id, start: symbol.data_start, end: symbol.data_end });

            }
          });

          //console.log(data);
           return Ids.length === 0 ? res.send('None found!') : res.json(Ids);
      })
      .catch(function (err) {
          return res.send(err.message);
      });

});

app.use('*', function (req, res) {
    res.status(404).json({ message: 'Not Found' });
});

// closeServer needs access to a server object, but that only
// gets created when `runServer` runs, so we declare `server` here
// and then assign a value to it in run
let server;

// this function connects to our database, then starts the server
function runServer(databaseUrl = DATABASE_URL, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, { useMongoClient: true }, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                console.log(`Your app is listening on port ${port}`);
                resolve();
            })
                .on('error', err => {
                    mongoose.disconnect();
                    reject(err);
                });
        });
    });
}

// this function closes the server, and returns a promise. we'll
// use it in our integration tests later.
function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    });
}

// if server.js is called directly (aka, with `node server.js`), this block
// runs. but we also export the runServer command so other code (for instance, test code) can start the server as needed.
if (require.main === module) {
    runServer().catch(err => console.error(err));
}

module.exports = { runServer, app, closeServer };
