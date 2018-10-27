process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();


chai.use(chaiHttp);
//Our parent block
describe('Classify', () => {
  describe('/Post classify', () => {
    it('it should return the trutfulness of the review', (done) => {
      const review = "Testing the endpoint"
      chai.request(server)
        .post('/classify')
        .send(review)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eql(0);
          done();
        });
    });
  });

});