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
        let min = 1000;

        object.previousValue = (Math.random() * (max - min + 1) + min).toFixed(2);
    }

    else {
        object.previousValue = value;
    }
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
            res.status(404).send(err.message);
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
            res.status(404).send(err.message);
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
            res.status(404).send(err.message);
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
            res.status(404).send(err.message);
        });

    //return response.json(a_BCH_Investment);
}

//for GETs
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

function getAllCoins(response) {
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

//GET:coinName:ID; they all send a response
function getSpecificETH(response, id) {

    return ETH_Investments.findById(id)
        .then((data) => {

            response.json(data.serialize());

        })
        .catch((err) => {
            return Promise.reject(err.message);
        });

}

function getSpecificBTC(response, id) {

    return BTC_Investments.findById(id)
        .then((data) => {

            response.json(data.serialize());

        })
        .catch((err) => {
            return Promise.reject(err.message);
        });

}

function getSpecificXRP(response, id) {

    return XRP_Investments.findById(id)
        .then((data) => {

            response.json(data.serialize());

        })
        .catch((err) => {
            return Promise.reject(err.message);
        });


}

function getSpecificBCH(response, id) {

    return BCH_Investments.findById(id)
        .then((data) => {

            response.json(data.serialize());

        })
        .catch((err) => {
            Promise.reject(err.message);
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

            Promise.resolve(data);
        })
        .catch((err) => {
            Promise.reject(err);
        });

}

function deleteAllOfBTC() {

    return BTC_Investments.find()
        .remove()
        .then((data) => {

            Promise.resolve(data);
        })
        .catch((err) => {
            Promise.reject(err);
        });

}

function deleteAllOfXRP() {

    return XRP_Investments.find()
        .remove()
        .then((data) => {

            Promise.resolve(data);
        })
        .catch((err) => {
            Promise.reject(err);
        });

}

function deleteAllOfBCH() {

    return BCH_Investments.find()
        .remove()
        .then((data) => {

            Promise.resolve(data);
        })
        .catch((err) => {
            Promise.reject(err);
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


v3Router.get('/investments', (req, res) => {

    getAllCoins(res);

});

//get all investments for a specific coin; not built yet
v3Router.get('/investments/:coinName', (req, res) => {
    res.send('Home');
});

//get a investment for a coinName lol.com/BTC/1204
v3Router.get('/investment/:coinName/:id', (req, res) => {

    let requiredParamsNames = ['coinName', 'id'];

    for (name in requiredParamsNames){
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
    }

});

//create a investment; needs a query
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
v3Router.put('/investment/:coinName/:id', (req, res) => {
    let requiredParamsNames = ['coinName', 'id'];
    let requiredBodyNames = ['investmentAmount', 'previousValue', 'date'];

    for (name in requiredBodyNames){
        if (!req.body[requiredBodyNames[name]]) {
            return res.status(404).send('Missing query.');
        }
    }

    for (name in requiredParamsNames){
        if (!req.params[requiredParamsNames[name]]) {
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

//del a investment
v3Router.delete('/investment/:coinName/:id', (req, res) => {
    let requiredQueryNames = ['coinName', 'id'];

    for (name in requiredQueryNames){
        if (!req.params[requiredQueryNames[name]]) {
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
    }

});

//delete all investments
v3Router.delete('/investments', (req, res) => {
    Promise.all([deleteAllOfBCH(response),deleteAllOfBTC(response), deleteAllOfXRP(response),deleteAllOfETH(response)])
        .then((data) => {
            console.log(data);
            res.status(201).end();
        })
        .catch((err) => {
            console.log(err.message);
            res.status(404).send(err.message);
        });
});


module.exports = v3Router;
