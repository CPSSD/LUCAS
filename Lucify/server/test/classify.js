/* eslint-disable no-unused-vars */
process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

const should = chai.should();

const server = require('../index');

chai.use(chaiHttp);
describe('Classify', () => {
  describe('/Post classify', () => {
    it('it should return the trutfulness of the review', (done) => {
      const review = 'Testing the endpoint';
      chai.request(server)
        .post('/api/review')
        .send({ review })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('classProbs');
          res.body.should.have.property('result');
          res.body.classProbs.should.be.a('array');
          res.body.result.should.be.oneOf(['Truthful', 'Deceptive']);
          done();
        });
    });
  });
});
