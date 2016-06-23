var models = require('../models');
var Page = models.Page;
var User = models.User;
var chai = require('chai');
var expect = chai.expect;
var spies = require('chai-spies');
chai.use(spies);

describe('Page model', function () {

    afterEach(function () {
      Page.destroy({
        where: {
          id : {$gt: -1}
        }
      });
    });

  describe('Virtuals', function () {
    var page;

    describe('route', function () {
      //page.urlTitle = 'some_title';
      page = Page.build({
        title: 'foo',
        content: 'bar',
        tags: ['foo', 'bar']
      });
      it('returns the url_name prepended by "/wiki/"', function (done) {
        page = Page.build({
          title: 'foo',
          content: 'bar',
          tags: ['foo', 'bar'],
          urlTitle: 'foo'
        });
        expect(page.route).to.equal('/wiki/foo');
        done();
      });
    });
    describe('renderedContent', function () {
        page = Page.build({
          title: 'foo',
          content: 'bar',
          tags: ['foo', 'bar'],
          urlTitle: 'foo'
        });
      it('converts the markdown-formatted content into HTML',function(){
        expect(page.renderedContent).to.equal('<p>bar</p>\n');
      });
    });
  });

  describe('Class methods', function () {
    describe('findByTag', function () {

      it('gets pages with the search tag', function (done) {
        Page.create({
          title: 'foo',
          content: 'bar',
          tags: ['foo', 'bar'],
          urlTitle: 'foo'
        })
        .then(function () {
          return Page.findByTag('foo');
        })
        .then (function (result) {
          expect(result[0].title).to.equal('foo');
          done();
        });
      });
      it('does not get pages without the search tag',function(done){
        Page.create({
          title: 'foo',
          content: 'bar',
          tags: ['foo', 'bar'],
          urlTitle: 'foo'
        })
        .then(function () {
          return Page.findByTag();
        })
        .then (function (result) {
          expect(result.length).to.equal(0);
          done();
        });
      });
    });
  });

  describe('Instance methods', function () {
    describe('findSimilar', function () {
      it('never gets itself',function (done){
        var page;
        Page.bulkCreate([
        {title: 'foo', content: 'foo content', tags: ['one', 'two'], urlTitle: 'foo'},
        {title: 'bar', content: 'bar content', tags: ['three'], urlTitle: 'bar'},
        {title: 'baz', content: 'baz content', tags: ['one'], urlTitle: 'baz'}
      ])
      .then (function () {
        Page.findOne({
          where: {
            title: 'foo'
          }
        })
        .then (function (result){
          page = result;
          return result.findSimilar();
        })
        .then (function (result){
          expect(result).to.not.include(page);
          done();
        });
      });

      });
      it('gets other pages with any common tags', function (done){
        var page;
        Page.bulkCreate([
        {title: 'foo', content: 'foo content', tags: ['one', 'two'], urlTitle: 'foo'},
        {title: 'bar', content: 'bar content', tags: ['three'], urlTitle: 'bar'},
        {title: 'baz', content: 'baz content', tags: ['one'], urlTitle: 'baz'}
      ])
      .then (function () {
       return Page.findOne({
          where: {
            title: 'baz'
          }
        });
      })
      .then (function (result) {
        page = result;
        return Page.findOne({
          where: {
            title: 'foo'
          }
        });
      })
        .then (function (result){
          return result.findSimilar();
        })
        .then (function (result){
          expect(result).to.include(page);
          done();
        });
      });
    it('does not get other pages without any common tags', function (done){
        var page;
        Page.bulkCreate([
        {title: 'foo', content: 'foo content', tags: ['one', 'two'], urlTitle: 'foo'},
        {title: 'bar', content: 'bar content', tags: ['three'], urlTitle: 'bar'},
        {title: 'baz', content: 'baz content', tags: ['one'], urlTitle: 'baz'}
      ])
      .then (function () {
       return Page.findOne({
          where: {
            title: 'bar'
          }
        });
      })
      .then (function (result) {
        page = result;
        return Page.findOne({
          where: {
            title: 'foo'
          }
        });
      })
        .then (function (result){
          return result.findSimilar();
        })
        .then (function (result){
          expect(result).to.not.include(page);
          done();
        });
      });
    });
  });

  describe('Validations', function () {
    it('errors without title',function (done){
      Page.create({
        content: 'i love them'
      })
      .catch(function (err){
        expect(err).to.exist;
        done();
      });
    });
    it('errors without content',function (done){
      Page.create({
        title: 'i love them'
      })
      .catch(function (err){
        expect(err).to.exist;
        done();
      });
    });
    it('errors given an invalid status',function (done){
      Page.create({
        title: "horse",
        content: 'i love them',
        status: "divorced"
      })
      .catch(function (err){
        expect(err).to.exist;
        done();
      });
    });
  });

  describe('Hooks', function () {
    it('it sets urlTitle based on title before validating', function (done) {
       Page.create({
        title: 'ti *tle',
        content: 'i love them'
      })
      .then (function (result) {
        expect(result.urlTitle).to.equal('ti_tle');
        done();
      });
    });
  });

});
