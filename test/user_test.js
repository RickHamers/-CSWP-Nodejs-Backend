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

/* chai setup */
chai.should();
chai.use(chaiHttp);

describe('User API CRUD functionality', () => {

    let testUser, token;

    /* runs once before each (individual) test */
    beforeEach(function(done) {
        this.timeout(10000);
        testUser = new User({username: 'TestUser', password: bcrypt.hashSync('password')});
        testUser.save(() => {
            token = jwt.sign({ id: testUser._id }, config.secretkey, {
                expiresIn: 86400 //Expires in 24 hrs
            });
            done()
            })
    });



    it('/POST api should return a user when posting a valid object', (done) => {
        chai.request(server)
            .post('/api/register')
            .send({ username: 'username',  password: 'password' })
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');

                const body = res.body;
                body.should.have.property('username').equals('username');
                body.should.have.property('__v').equals(0);

                done();
            })
    }).timeout(5000);

    it('/POST api should return an error code 422 when posting an object without a username', (done) => {
        chai.request(server)
            .post('/api/register')
            .send({ username: '', password: 'testPassword'})
            .end((err, res) => {
                res.should.have.status(422);

                done();
            })
    }).timeout(5000);

    it('/POST api should return an error code 422 when posting an object without a password', (done) => {
        chai.request(server)
            .post('/api/register')
            .send({ username: 'testUser', password: ''})
            .end((err, res) => {
                res.should.have.status(422);

                done();
            })
    }).timeout(5000);

    it('/POST api should return an error code 409 when posting an object with a username that already exists', (done) => {
        chai.request(server)
            .post('/api/register')
            .send({ username: 'testUser', password: 'testPassword'})
            .end(() => {
                chai.request(server)
                    .post('/api/register')
                    .send({ username: 'testUser', password: 'testPassword'
                    })
                    .end((err, res) => {
                        res.should.have.status(409);

                        done();
                    })
            })
    }).timeout(5000);

    it('/DELETE api should return status 404 when deleting a non-existant user', (done) => {
        chai.request(server)
            .delete('/api/user')
            .set('x-access-token', token)
            .send({ username: 'testUser', password: 'password'})
            .end((err, res) => {
                res.should.have.status(404);
                res.should.be.a('object');

                done();
            })
    }).timeout(5000);

    it('/DELETE api should return status 401 when the password is incorrect when deleting a valid user', (done) => {

        chai.request(server)
            .delete('/api/user')
            .set('x-access-token', token)
            .send({ username: 'TestUser', password: 'testPassword1'})
            .end((err, res) => {
                res.should.have.status(401);
                res.should.be.a('object');

                done();
            })

    }).timeout(5000);

    it('/DELETE api should return status 500 when the password is omitted when deleting a valid user', (done) => {

        chai.request(server)
            .delete('/api/user')
            .set('x-access-token', token)
            .send({ username: 'TestUser', password: ''})
            .end((err, res) => {
                res.should.have.status(500);
                res.should.be.a('object');

                done();
            })

    }).timeout(5000);

    it('/DELETE api should return status 500 when the username is omitted when deleting a valid user', (done) => {

        chai.request(server)
            .delete('/api/user')
            .set('x-access-token', token)
            .send({ username: '', password: 'password'})
            .end((err, res) => {
                res.should.have.status(500);
                res.should.be.a('object');

                done();
            })

    }).timeout(5000);

    it('/GET api should return a user when getting a valid object', (done) => {

        chai.request(server)

            .get('/api/user?username=TestUser')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');

                const body = res.body;
                body.should.have.property('username').equals('TestUser');
                body.should.have.property('__v').equals(0);

                done();
            })

    }).timeout(5000);

    it('/GET api should return status 404 when a user is not found', (done) => {

        chai.request(server)
            .get('/api/user?username=testUser1')
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(404);
                res.should.be.a('object');

                done()
            })

    }).timeout(5000);

    it('/PUT api should return status 200 when putting a valid user', (done) => {

        chai.request(server)
            .put('/api/user')
            .send({ username: 'TestUser', password: 'password', newPassword: 'newTestPassword' })
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');

                done();
            })

    }).timeout(5000);

    it('/PUT api should return a status 401 when the password for a user is incorrect', (done) => {

        chai.request(server)
            .put('/api/user')
            .send({ username: 'TestUser',  password: 'newTestPassword', newPassword:'newTestingPassword' })
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(401);
                res.should.be.a('object');

                done();
            })

    }).timeout(5000);

    it('/PUT should return a status 500 when the user is not found when putting a user', (done) => {
        chai.request(server)
            .put('/api/user')
            .send({ username: 'testUser', password: 'testPassword', newPassword: 'newTestPassword' })
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(404);
                res.should.be.a('object');

                done();
            })
    }).timeout(5000);

    it('/PUT should return a status 500 when the username for putting a user is omitted', (done) => {

        chai.request(server)
            .put('/api/user')
            .send({ username: '',  password: 'newTestPassword', newPassword:'newTestingPassword' })
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(500);
                res.should.be.a('object');

                done();
            })

    }).timeout(5000);

    it('/PUT should return a status 500 when the password for putting a user is omitted', (done) => {

        chai.request(server)
            .put('/api/user')
            .send({ username: 'TestUser',  password: '', newPassword:'newTestingPassword' })
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(500);
                res.should.be.a('object');

                done();
            })

    }).timeout(5000);

    it('/PUT should return a status 500 when the new password for putting a user is omitted', (done) => {

        chai.request(server)
            .put('/api/user')
            .send({ username: 'TestUser',  password: 'password', newPassword:'' })
            .set('x-access-token', token)
            .end((err, res) => {
                res.should.have.status(500);
                res.should.be.a('object');

                done();
            })

    }).timeout(5000);

    it('/DELETE api should return status 200 when deleting a valid user', (done) => {
        chai.request(server)
            .delete('/api/user')
            .set('x-access-token', token)
            .send({ username: 'TestUser', password: 'password'})
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.a('object');

                done();
            })
    }).timeout(5000);
});
