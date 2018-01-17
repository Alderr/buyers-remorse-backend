'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const BTC_Investments_Schema = mongoose.Schema({
  previousValue: {type: Number, required: true},
  investmentAmount: {type: Number, required: true},
  date: {type: Date, default: Date.now}
});


BTC_Investments_Schema.virtual('created_coinAmount').get(function() {
  return this.investmentAmount/this.previousValue;
});

BTC_Investments_Schema.mBTCods.serialize = function() {
  return {
    id: this._id,
    previousValue: this.previousValue,
    investmentAmount: this.investmentAmount,
    coinAmount: this.created_coinAmount,
    date: this.date
  };
};

const BTC_Investments = mongoose.model('BTC_Investments', BTC_Investments_Schema);


module.exports = { BTC_Investments };
