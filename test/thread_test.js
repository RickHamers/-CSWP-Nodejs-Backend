/*
    user_test.js - tests for users
 */

/* require necessary modules and files */
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server');

/* chai setup */
chai.should();
chai.use(chaiHttp);

describe('Thread API CRUD functionality', () => {
    it('should return a thread when posting a valid object', (done) => {
        chai.request(server)
            .post('/api/user')
            .send({ username: 'testUser',  password: 'testPassword' })
            .end((err, res) => {
                chai.request(server)
                    .post('/api/thread')
                    .send({
                        title: 'testTitle',
                        content: 'testContent',
                        username: 'testUser',
                        upVote: [{
                            name: 'testUser'
                        }],
                        downVote: [{
                            name: 'testUser'
                        }]
                    })
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.should.be.a('object');

                        const body = res.body;
                        body.should.have.property('title').equals('testTitle');
                        body.should.have.property('content').equals('testContent');
                        body.should.have.property('username').equals('testUser');
                        body.should.have.property('__v').equals(0);
                        done();
                    })
            })
    }).timeout(5000);

    it('/GET api should return status 404 when no threads are found', (done) => {
        chai.request(server)
            .get('/api/threads')
            .end((err, res) => {
                res.should.have.status(404);
                res.should.be.a('object');

                done();
            })
    }).timeout(5000);
});