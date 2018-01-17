const chai = require('chai');
const chaiHTTP = require('chai-http');

const { runServer, closeServer, app } = require('../server');

let TEST_DATABASE_URL = process.env.TEST_DATABASE_URL;
let PORT = process.env.PORT;

const should = chai.should();

chai.use(chaiHTTP);

describe('GET / HOME ENDPOINT', () => {

  before(function () {
    return runServer(TEST_DATABASE_URL, PORT);
  });

  after(function () {
    return closeServer();
  });

  it('should return a status of 200', () => {
    return chai.request(app)
      .get('/')
      .then( (response) => {
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
