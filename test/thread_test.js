/*
    user_test.js - tests for users
 */

/* require necessary modules and files */
const chai = require('chai');
const mongoose = require('mongoose');
const chaiHttp = require('chai-http');
const server = require('../src/server');
let jwt = require('jsonwebtoken');
let bcrypt = require('bcryptjs');
let config = require('../src/config/config');
let User = require('../src/model/user');
let Thread = require('../src/model/thread').thread;

/* chai setup */
chai.should();
chai.use(chaiHttp);

describe('Thread API CRUD functionality', () => {

    let testUser, token, testThread;

    /* runs once before each (individual) test */
    beforeEach(function(done) {
        this.timeout(10000);
        testUser = new User({username: 'TestUser', password: bcrypt.hashSync('password')});
        testThread = new Thread({content: 'content', threadId: 'threadId', username: 'TestUser'});
        testUser.save(() => {
            token = jwt.sign({ id: testUser._id }, config.secretkey, {
                expiresIn: 86400 //Expires in 24 hrs
            });
            testThread.save(() =>{

            });
            done()
        })
    });

    it('should return a thread when posting a valid object', (done) => {

        chai.request(server)
            .post('/api/thread')
            .set('x-access-token', token)
            .send({
                title: 'testTitle',
                content: 'testContent',
                username: 'TestUser',
                upVote: [{
                    name: 'TestUser'
                }],
                downVote: [{
                    name: 'TestUser'
                }]
            })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');

                const body = res.body;
                body.should.have.property('title').equals('testTitle');
                body.should.have.property('content').equals('testContent');
                body.should.have.property('username').equals('TestUser');
                body.should.have.property('__v').equals(0);
                done();
            })
    });


    it('/GET api should return status 404 when no threads are found', (done) => {
        chai.request(server)
            .get('/api/threads')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(404);
                res.should.be.a('object');

                done();
            })
    })
}).timeout(5000);
