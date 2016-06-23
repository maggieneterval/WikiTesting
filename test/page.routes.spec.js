var supertest = require('supertest');
var app = require('../app');
var agent = supertest.agent(app); //this agent starts up the server
var models = require('../models');
var Page = models.Page;
var User = models.User;
var chai = require('chai');
var expect = chai.expect;
var spies = require('chai-spies');
chai.use(spies);

describe('http requests', function () {

  afterEach(function () {
    Page.destroy({
      where: {
        id : {$gt: -1}
      }
    });
  });

  describe('GET /wiki/', function () {
    it('responds with 200', function (done) {
      agent
      .get('/wiki')
      .expect(200, done);
    });
  });

  describe('GET /wiki/add', function () {
    it('responds with 200', function (done) {
      agent
      .get('/wiki/add')
      .expect(200, done);
    });
  });


  describe('GET /wiki/:urlTitle', function () {

    it('responds with 200', function (done) { //the entire promise chain should go inside "it"
      Page.create({
        title: 'foo',
        content: 'i <3 foo'
      })
      .then(function (){
        agent
        .get('/wiki/foo')
        .expect(200, done);
      });
    });
  });

  describe('GET /wiki/search', function () {
    it('responds with 200', function (done) {
      agent
      .get('/wiki/search')
      .expect(200, done);
    });
  });

  describe('GET /wiki/:urlTitle/similar', function () {
    it('responds with 404 for page that does not exist', function (done) {
      Page.bulkCreate([
        {title: 'foo', content: 'foo content', tags: ['one', 'two'], urlTitle: 'foo'},
        {title: 'bar', content: 'bar content', tags: ['three'], urlTitle: 'bar'}
      ])
      .then( function () {
        agent
        .get('/wiki/star/similar')
        .expect(404, done);
      });
    });
    it('responds with 200 for similar page', function (done) {
      Page.bulkCreate([
        {title: 'foo', content: 'foo content', tags: ['one', 'two'], urlTitle: 'foo'},
        {title: 'bar', content: 'bar content', tags: ['three'], urlTitle: 'bar'}
      ])
      .then( function () {
        agent
        .get('/wiki/foo/similar')
        .expect(200, done);
      });
    });
  });

  describe('POST /wiki', function () {
    it('responds with 302',function (done){
      agent
      .post('/wiki')
      .send({name: 'fooman', email: 'foo@foo.com', title:'foo', content: 'foo content'})
      .expect(302,done);
    });
    it('creates a page in the database',function (done){
      agent
      .post('/wiki')
      .send({name: 'fooman', email: 'foo@foo.com', title:'foo', content: 'foo content'})
      .then(function(){
        Page.findOne({
          where: {
            title: 'foo'
          }
        })
        .then(function(result){
          expect(result).to.exist;
          done(); //MAGIC!!!!
        })
      });
    });
  });

});
