'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const ETH_Investments_Schema = mongoose.Schema({
  previousValue: {type: Number, required: true},
  investmentAmount: {type: Number, required: true},
  date: {type: Date, default: Date.now}
});


ETH_Investments_Schema.virtual('created_coinAmount').get(function() {
  return this.investmentAmount/this.previousValue;
});

ETH_Investments_Schema.methods.serialize = function() {
  return {
    id: this._id,
    previousValue: this.previousValue,
    investmentAmount: this.investmentAmount,
    date: this.date,
    coinAmount: this.created_coinAmount
  };
};

const ETH_Investments = mongoose.model('ETH_Investments', ETH_Investments_Schema);


module.exports = { ETH_Investments };
