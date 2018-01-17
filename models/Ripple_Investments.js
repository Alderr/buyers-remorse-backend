'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const XRP_Investments_Schema = mongoose.Schema({
  previousValue: {type: Number, required: true},
  investmentAmount: {type: Number, required: true},
  date: {type: Date, default: Date.now}
});


XRP_Investments_Schema.virtual('created_coinAmount').get(function() {
  return this.investmentAmount/this.previousValue;
});

XRP_Investments_Schema.mXRPods.serialize = function() {
  return {
    id: this._id,
    previousValue: this.previousValue,
    investmentAmount: this.investmentAmount,
    coinAmount: this.created_coinAmount,
    date: this.date
  };
};

const XRP_Investments = mongoose.model('XRP_Investments', XRP_Investments_Schema);


module.exports = { XRP_Investments };
