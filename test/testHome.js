const chai = require('chai');
const chaiHTTP = require('chai-http');

const app = require('../server');

const should = chai.should();
chai.use(chaiHTTP);

describe('GET / HOME ENDPOINT', () => {
  it('should return a status of 200', () => {
    return chai.request(app)
      .get('/')
      .then( (response) => {
        console.log(response);
        response.should.have.status(200);
      });
  })
});

describe('GET / INFO FROM COIN API ENDPOINT', () => {
  it('should return coin names', () => {
    return chai.request(app)
      .get('/coinNames')
      .then( (response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.a('Object');

      });
  })
});
