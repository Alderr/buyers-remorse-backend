const express = require('express');
const rp = require('request-promise');

const { BCH_Investments } = require('../models/Bitcoin_Cash_Investment');
const { ETH_Investments } = require('../models/Ethereum_Investment');
const { XRP_Investments } = require('../models/Ripple_Investment');
const { BTC_Investments } = require('../models/Bitcoin_Investment');

const API_KEY = process.env.API_KEY;
console.log(API_KEY);

let models = {
    ETH: ETH_Investments,
    BTC: BTC_Investments,
    BCH: BCH_Investments,
    XRP: XRP_Investments
};

let currentValue = {
    expirationDate: 1,
    coinName : {
        ETH: 1,
        BTC: 1,
        BCH: 1,
        XRP: 1
    }
};

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
        let min = 1000;

        object.previousValue = (Math.random() * (max - min + 1) + min).toFixed(2);
    }

    else {
        object.previousValue = value;
    }
}
//func for add
function addObjectValues (object, values) {
    object.nowValue = values.coinName[object.coinName];
    object.investmentAmountNow = (values.coinName[object.coinName]/object.previousValue * object.investmentAmount).toFixed(2);
    object.percentageChange = (values.coinName[object.coinName]/object.previousValue * 100).toFixed(4);
}

function addInvestmentInfo(object, values) {
    let coinName = object.coinName;
    console.log('values.coinName is..' + values.coinName);
    console.log('in addProfit');
    console.log('coinName is.. ' + coinName);
    console.log('curr value is.. ' + values.coinName[coinName]);
    console.log('prev val is.. ' + object.previousValue);
    console.log('inv Amount is.. ' + object.investmentAmount);

    switch(coinName) {
    case 'XRP':
        addObjectValues(object, values);
        break;
    case 'ETH':
        addObjectValues(object, values);
        break;
    case 'BCH':
        addObjectValues(object, values);
        break;
    case 'BTC':
        addObjectValues(object, values);
        break;
    default:
        break;
    }

    console.log('------');
}

function getSpecificCoinCurrentValueFromApi(coinName, resolve, reject) {

    console.log('in getSpecificCoinCurrentValueFromApi');

    var currentRateOptions = {
        method: 'GET',
        uri: `https://min-api.cryptocompare.com/data/price?fsym=${coinName}&tsyms=USD`,
        json: true // Automatically parses the JSON string in the response
    };

    return rp(currentRateOptions)
        .then(function (data) {
            console.log('Price for ' + coinName + ' is...');
            console.log(data.USD);
            console.log('-----------');
            currentValue.coinName[coinName] = data.USD;
            console.log(currentValue);
            return resolve(currentValue);
            //return resolve(6);
        })
        .catch(function (err) {
            return reject(err.message);
        });

}

//for getCurrentValues
function callAPI(currentValueHolder) {

    console.log('in callAPI');
    let arrOfApiCalls = [];

    //return Promise.resolve(currentValue);
    for (let x in currentValueHolder.coinName) {
        console.log('coinName');
        console.log(x);
        console.log('------');

        arrOfApiCalls.push(function () {
            return new Promise((resolve, reject) => {
                return getSpecificCoinCurrentValueFromApi(x, resolve, reject);

            });
        });

    }

    console.log('callingfunctions in arrOfApiCalls');

    return Promise.all(arrOfApiCalls.map((aFunc) => {
        return aFunc();

    })).then((data) => {
        console.log('promise.all');
        console.log(data);
        console.log('======');

        return Promise.resolve(data);
    });

}

function getCurrentValues(currentValueHolder) {

    if (Date.now() - currentValueHolder.expirationDate > 60000) {
        console.log('Expired!');
        currentValueHolder.expirationDate = Date.now();
        console.log('out of getCurrentValues');

        return callAPI(currentValueHolder);
    }

    else if(Date.now() - currentValueHolder.expirationDate < 60000) {
        console.log('An minute isnt up yet.');
        return Promise.resolve(currentValueHolder);
    }

    return Promise.reject('ERROR?');
}

//for GET ALL, GET/:coinName
function getAllCoinName(model, values) {
    let coin_data = [];

    console.log('in gotAllCoinName');
    return model.find()
        .then((data) => {

            data.forEach((investment) => {
                let temp_investment = investment.serialize();
                addInvestmentInfo(temp_investment, values);
                console.log('New investment is..');
                console.log(investment);
                console.log('--------');
                coin_data.push(temp_investment);
            });
            console.log('out of gotAllCoinName');
            return Promise.resolve(coin_data);

        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err.message);
        });
}

// for post; they all send a response
function addToETH(response, investmentAmount, previousValue, date) {

    let a_ETH_Investment = {
        investmentAmount: investmentAmount
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
            response.status(404).send(err.message);
        });

    //return response.json(a_ETH_Investment);
}

function addToBTC(response, investmentAmount, previousValue, date) {

    let a_BTC_Investment = {
        investmentAmount: investmentAmount
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
            response.status(404).send(err.message);
        });

    //return response.json(a_BTC_Investment);
}

function addToXRP(response, investmentAmount, previousValue, date) {

    let a_XRP_Investment = {
        investmentAmount: investmentAmount
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
            response.status(404).send(err.message);
        });

    //return response.json(a_XRP_Investment);
}

function addToBCH(response, investmentAmount, previousValue, date) {

    let a_BCH_Investment = {
        investmentAmount: investmentAmount
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
            response.status(404).send(err.message);
        });

    //return response.json(a_BCH_Investment);
}

function getAllETH() {
    let ETH_data = [];

    return ETH_Investments.find()
        .then((data) => {

            data.forEach((investment) => {
                ETH_data.push(investment.serialize());
            });

            return Promise.resolve(ETH_data);

        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err.message);
        });

}

function getAllBTC() {

    let BTC_data = [];

    return BTC_Investments.find()
        .then((data) => {

            data.forEach((investment) => {
                BTC_data.push(investment.serialize());
            });

            return Promise.resolve(BTC_data);

        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err.message);
        });

}

function getAllXRP() {
    let XRP_data = [];

    return XRP_Investments.find()
        .then((data) => {

            data.forEach((investment) => {
                XRP_data.push(investment.serialize());
            });

            return Promise.resolve(XRP_data);

        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err.message);
        });


}

function getAllBCH() {
    let BCH_data = [];

    return BCH_Investments.find()
        .then((data) => {

            data.forEach((investment) => {
                BCH_data.push(investment.serialize());
            });

            return Promise.resolve(BCH_data);

        })
        .catch((err) => {
            Promise.reject(err.message);
        });

}

//new & improved w/ MOAR BUGS fk
function getAllCoinsv2(response, values) {
    let all_data = [];
    let all_calls_to_database = [];

    console.log('in getAllCoinsv2');

    for (let model in models){
        console.log('This model is... ' + model);
        all_calls_to_database.push(function () {
            return getAllCoinName(models[model], values);
        });
    }

    return Promise.all(all_calls_to_database.map((func) => {
        return func();
    }))
        .then((data) => {

            console.log('in getAllCoinsv2 promiseAll - success');

            for (let x in data) {
                all_data = all_data.concat(data[x]);
            }
            console.log('sent all_data');
            console.log('-----------------');
            console.log(all_data);
            console.log('-----------------');
            return Promise.resolve(all_data);
        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err.message);
        });
}

//old one
function getAllCoins(response, values) {
    let all_data = [];

    Promise.all([getAllBCH(),getAllBTC(), getAllXRP(),getAllETH()])
        .then((data) => {

            console.log('Here!');

            for (x in data) {
                all_data = all_data.concat(data[x]);
            }

            response.json(all_data);
        })
        .catch((err) => {
            console.log(err.message);
            response.status(404).send(err.message);
        });

}

//GET/:coinName/:ID;  they all send a response
function getSpecificETH(response, id) {

    return ETH_Investments.findById(id)
        .then((data) => {

            response.json(data.serialize());

        })
        .catch((err) => {
            response.status(404).send(err.message);
        });

}

function getSpecificBTC(response, id) {

    return BTC_Investments.findById(id)
        .then((data) => {

            response.json(data.serialize());

        })
        .catch((err) => {
            response.status(404).send(err.message);
        });

}

function getSpecificXRP(response, id) {

    return XRP_Investments.findById(id)
        .then((data) => {

            response.json(data.serialize());

        })
        .catch((err) => {
            response.status(404).send(err.message);
        });


}

function getSpecificBCH(response, id) {

    return BCH_Investments.findById(id)
        .then((data) => {

            response.json(data.serialize());

        })
        .catch((err) => {
            response.status(404).send(err.message);
        });

}

//for del; ; they all send a response
function deleteSpecificETH(response, id) {

    return ETH_Investments.findById(id)
        .remove()
        .then((data) => {
            console.log(data);
            response.status(201).end();
        })
        .catch((err) => {
            response.status(404).send(err.message);
        });

}

function deleteSpecificBTC(response, id) {

    return BTC_Investments.findById(id)
        .remove()
        .then((data) => {
            console.log(data);
            response.status(201).end();
        })
        .catch((err) => {
            response.status(404).send(err.message);
        });

}

function deleteSpecificXRP(response, id) {

    return XRP_Investments.findById(id)
        .remove()
        .then((data) => {
            console.log(data);
            response.status(201).end();
        })
        .catch((err) => {
            response.status(404).send(err.message);
        });

}

function deleteSpecificBCH(response, id) {

    return BCH_Investments.findById(id)
        .remove()
        .then((data) => {
            console.log(data);
            response.status(201).end();
        })
        .catch((err) => {
            response.status(404).send(err.message);
        });

}

function deleteAllOfETH() {

    return ETH_Investments.find()
        .remove()
        .then((data) => {
            return Promise.resolve(data);
        })
        .catch((err) => {
            console.log(err);
            return Promise.reject(err);
        });

}

function deleteAllOfBTC() {

    return BTC_Investments.find()
        .remove()
        .then((data) => {
            return Promise.resolve(data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });

}

function deleteAllOfXRP() {

    return XRP_Investments.find()
        .remove()
        .then((data) => {
            return Promise.resolve(data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });

}

function deleteAllOfBCH() {

    return BCH_Investments.find()
        .remove()
        .then((data) => {
            return Promise.resolve(data);
        })
        .catch((err) => {
            return Promise.reject(err);
        });

}

//update
function updateSpecificETH(response, id, investmentAmount, previousValue, date) {

    let a_ETH_Investment = {
        investmentAmount: investmentAmount,
        previousValue: previousValue,
        date: date
    };

    //update a specific ETH_investment
    ETH_Investments
        .findById(id)
        .update({ $set: a_ETH_Investment })
        .then((data) => {

            console.log(data);
            response.status(202).send(data);

        })
        .catch((err) => {

            console.log(err.message);
            response.status(404).send(err.message);

        });

}

function updateSpecificBTC(response, id, investmentAmount, previousValue, date) {

    let a_BTC_Investment = {
        investmentAmount: investmentAmount,
        previousValue: previousValue,
        date: date
    };

    //update a specific BTC_investment
    BTC_Investments
        .findById(id)
        .update({ $set: a_BTC_Investment })
        .then((data) => {

            console.log(data);
            response.status(202).send(data);

        })
        .catch((err) => {

            console.log(err.message);
            response.status(404).send(err.message);

        });

}

function updateSpecificXRP(response, id, investmentAmount, previousValue, date) {

    let a_XRP_Investment = {
        investmentAmount: investmentAmount,
        previousValue: previousValue,
        date: date
    };

    //update a specific XRP_investment
    XRP_Investments
        .findById(id)
        .update({ $set: a_XRP_Investment })
        .then((data) => {

            console.log(data);
            response.status(202).send(data);

        })
        .catch((err) => {

            console.log(err.message);
            response.status(404).send(err.message);

        });

}

function updateSpecificBCH(response, id, investmentAmount, previousValue, date) {

    let a_BCH_Investment = {
        investmentAmount: investmentAmount,
        previousValue: previousValue,
        date: date
    };

    //update a specific BCH_investment
    BCH_Investments
        .findById(id)
        .update({ $set: a_BCH_Investment })
        .then((data) => {

            console.log(data);
            response.status(202).send(data);

        })
        .catch((err) => {

            console.log(err.message);
            response.status(404).send(err.message);

        });

}


//get all investments for a specific coin - PARAMS: [coinName]
v3Router.get('/investments/:coinName', (req, res) => {

    let requiredParamsNames = ['coinName'];

    for (let name in requiredParamsNames){
        if (!req.params[requiredParamsNames[name]]) {
            return res.status(404).send('Missing query.');
        }
    }

    let { coinName } = req.params;

    switch(coinName) {
    case 'XRP':
        getAllXRP()
            .then((data) => {
                res.json(data);
            });
        break;
    case 'ETH':
        getAllETH(res)
            .then((data) => {
                res.json(data);
            });
        break;
    case 'BCH':
        getAllBCH(res)
            .then((data) => {
                res.json(data);
            });
        break;
    case 'BTC':
        getAllBTC(res)
            .then((data) => {
                res.json(data);
            });
        break;
    default:
        res.send('No such coin.');
    }

});

//get a investment for a coin - PARAMS: [coinName] / [id]
v3Router.get('/investments/:coinName/:id', (req, res) => {

    let requiredParamsNames = ['coinName', 'id'];

    for (let name in requiredParamsNames){
        if (!req.params[requiredParamsNames[name]]) {
            return res.status(404).send('Missing query.');
        }
    }

    let { coinName, id } = req.params;

    switch(coinName) {
    case 'XRP':
        getSpecificXRP(res, id);
        break;
    case 'ETH':
        getSpecificETH(res, id);
        break;
    case 'BCH':
        getSpecificBCH(res, id);
        break;
    case 'BTC':
        getSpecificBTC(res, id);
        break;
    default:
        res.send('No such coin.');
    }

});

//gets all investments
v3Router.get('/investments', (req, res) => {

    getCurrentValues(currentValue)
        .then(() => {
            console.log('getCurrentValues - success');

            return getAllCoinsv2(res, currentValue);
        })
        .then((data) => {
            console.log('?????????????????');

            //console.log(data);
            console.log('recieved data?');
            console.log('??????????????????');
            res.json(data);
        })
        .catch((err) => {
            res.send(err.message);
        });


    // return getAllCoinsv2(res, currentValue)
    //     .then((data) => {
    //         console.log('?????????????????');
    //
    //         //console.log(data);
    //         console.log('recieved data?');
    //         console.log('??????????????????');
    //         res.json(data);
    //     })
    //     .catch((err) => {
    //         res.send(err.message);
    //     });

});

//get all investments for a specific coin - PARAMS: [coinName]
v3Router.get('/investments/:coinName', (req, res) => {

    let requiredParamsNames = ['coinName'];

    for (let name in requiredParamsNames){
        if (!req.params[requiredParamsNames[name]]) {
            return res.status(404).send('Missing query.');
        }
    }

    let { coinName } = req.params;

    switch(coinName) {
    case 'XRP':
        getAllXRP()
            .then((data) => {
                res.json(data);
            });
        break;
    case 'ETH':
        getAllETH(res)
            .then((data) => {
                res.json(data);
            });
        break;
    case 'BCH':
        getAllBCH(res)
            .then((data) => {
                res.json(data);
            });
        break;
    case 'BTC':
        getAllBTC(res)
            .then((data) => {
                res.json(data);
            });
        break;
    default:
        res.send('No such coin.');
    }

});

//get a investment for a coin - PARAMS: [coinName] / [id]
v3Router.get('/investments/:coinName/:id', (req, res) => {

    let requiredParamsNames = ['coinName', 'id'];

    for (let name in requiredParamsNames){
        if (!req.params[requiredParamsNames[name]]) {
            return res.status(404).send('Missing query.');
        }
    }

    let { coinName, id } = req.params;

    switch(coinName) {
    case 'XRP':
        getSpecificXRP(res, id);
        break;
    case 'ETH':
        getSpecificETH(res, id);
        break;
    case 'BCH':
        getSpecificBCH(res, id);
        break;
    case 'BTC':
        getSpecificBTC(res, id);
        break;
    default:
        res.send('No such coin.');
    }

});

//create a investment - BODY: [coinName] [investmentAmount], [previousValue=canBeEmpty], [date=canBeEmpty]
v3Router.post('/investments', (req, res) => {
    let requiredQueryNames = ['coinName', 'investmentAmount'];

    for (let name in requiredQueryNames){
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
    default:
        res.send('No such coin.');
    }

});

//update a investment - BODY: [coinName] [investmentAmount], [previousValue], [date]
v3Router.put('/investments/:coinName/:id', (req, res) => {
    let requiredParamsNames = ['coinName', 'id'];
    let requiredBodyNames = ['investmentAmount', 'previousValue', 'date'];

    for (let name in requiredParamsNames){
        if (!req.params[requiredParamsNames[name]]) {
            return res.status(404).send('Missing query.');
        }
    }

    for (let name in requiredBodyNames){
        if (!req.body[requiredBodyNames[name]]) {
            return res.status(404).send('Missing query.');
        }
    }

    let { coinName, id } = req.params;
    let { investmentAmount, date, previousValue } = req.body;

    //decide whether to add to ETH, BTC, XRP, BCH
    switch(coinName) {
    case 'XRP':
        updateSpecificXRP(res, id, investmentAmount, previousValue, date);
        break;
    case 'ETH':
        updateSpecificETH(res, id, investmentAmount, previousValue, date);
        break;
    case 'BCH':
        updateSpecificBCH(res, id, investmentAmount, previousValue, date);
        break;
    case 'BTC':
        updateSpecificBTC(res, id, investmentAmount, previousValue, date);
        break;
    }


});

//del a investment - PARAMS: [coinName] / [id]
v3Router.delete('/investments/:coinName/:id', (req, res) => {
    let requiredParamsNames = ['coinName', 'id'];

    for (let name in requiredParamsNames){
        if (!req.params[requiredParamsNames[name]]) {
            return res.status(404).send('Missing query.');
        }
    }

    let { coinName, id } = req.params;

    switch(coinName) {
    case 'XRP':
        deleteSpecificXRP(res, id);
        break;
    case 'ETH':
        deleteSpecificETH(res, id);
        break;
    case 'BCH':
        deleteSpecificBCH(res, id);
        break;
    case 'BTC':
        deleteSpecificBTC(res, id);
        break;
    default:
        res.send('No such coin.');
    }

});

//delete all investments NUKE
v3Router.delete('/investments', (req, res) => {

    Promise.all([deleteAllOfBCH(res),deleteAllOfBTC(res), deleteAllOfXRP(res),deleteAllOfETH(res)])
        .then((data) => {
            console.log(data);
            res.status(204).end();
        })
        .catch((err) => {
            console.log(err.message);
            res.status(404).send(err.message);
        });
});


module.exports = v3Router;
