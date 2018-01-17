'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const BCH_Investments_Schema = mongoose.Schema({
  previousValue: {type: Number, required: true},
  investmentAmount: {type: Number, required: true},
  date: {type: Date, default: Date.now}
});


BCH_Investments_Schema.virtual('created_coinAmount').get(function() {
  return this.investmentAmount/this.previousValue;
});

BCH_Investments_Schema.mBCHods.serialize = function() {
  return {
    id: this._id,
    previousValue: this.previousValue,
    investmentAmount: this.investmentAmount,
    coinAmount: this.created_coinAmount,
    date: this.date
  };
};

const BCH_Investments = mongoose.model('BCH_Investments', BCH_Investments_Schema);


module.exports = { BCH_Investments };
