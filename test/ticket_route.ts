import app from '../src';
import chai from 'chai';
import chaiHttp = require('chai-http');
import 'mocha';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Hello API Request', () => {
    it('should return response on call', () => {
        return chai.request(app).get('/tickets')
            .then(res => {
                chai.expect(res.status).to.eql(200);
            })
    })
})