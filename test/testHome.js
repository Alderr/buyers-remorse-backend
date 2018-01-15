const chai = require('chai');
const chaiHTTP = require('chai-http');

const should = chai.should();
const app  = require('../server');


chai.use(chaiHTTP);

describe('GET / HOME ENDPOINT', () => {
  it('should return a status of 200', () => {
    chai.request(app)
      .get('/')
      .then( (response) => {
        response.should.have.status(200);

      });
  })
});
