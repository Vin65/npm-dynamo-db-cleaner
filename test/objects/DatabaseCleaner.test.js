const Cleaner = require('./../../src/objects/DatabaseCleaner');
const expect = require('chai').expect;
const sinon = require('sinon');

describe('cleaner', function() {
  beforeEach(function() {
    this.dynamo = { getDocumentClient: function() {} };
    this.getDocumentClient = sinon.stub(this.dynamo, 'getDocumentClient');
    this.database = {scan: function() {} , delete: function() {} };
    this.getDocumentClient.returns(this.database);
    this.cleaner = new Cleaner(this.dynamo);
    this.cb = () => {};
  });

  afterEach(function() {
    this.getDocumentClient.restore();
  })

  describe('#deleteAllItemsForTable', function() {
    it('scans the right database', function() {
      let spy = sinon.spy(this.cleaner, '_scan');
      this.cleaner.deleteAllItemsForTable('Some table', [], this.cb).then(data => {
        expect(spy.calledWith('Some table')).to.be.eql(true);
      })
    });

    context('when scan returns several items', function() {
      beforeEach(function() {
        this.scan = sinon.stub(this.cleaner, '_scan');
        this.scan.resolves({ Items: [1, 2] });
      });

      afterEach(function() {
        this.scan.restore();
      })

      it('deletes all items in the table', async function() {
        let spy = sinon.spy(this.cleaner, '_delete');
        this.cleaner.deleteAllItemsForTable('Some table', [], this.cb).then(data => {
          expect(spy.calledTwice).to.be.eql(true)
        })
      })

      it('invokes the callback after the function has finished', function() {
        sinon.stub(this.cleaner, '_delete').resolves(true)
        let spy = sinon.spy(this, 'cb')
        this.cleaner.deleteAllItemsForTable('Some table', [], this.cb).then(data => {
          expect(spy.called).to.be.eql(true)
        })
      });
    });

    context('when scan returns not items', function() {
      beforeEach(function() {
        this.scan = sinon.stub(this.cleaner, '_scan');
        this.scan.resolves({ Items: [] });
      });

      afterEach(function() {
        this.scan.restore();
      })

      it('does not attemp a delete', function() {
        let spy = sinon.spy(this.cleaner, '_delete');
        this.cleaner.deleteAllItemsForTable('Some table', [], this.cb).then(data => {
          expect(spy.called).to.be.eql(false)
        })
      })

      it('invokes the callback after the function has finished', function() {
        let spy = sinon.spy(this, 'cb')
        this.cleaner.deleteAllItemsForTable('Some table', [], this.cb).then(data => {
          expect(spy.called).to.be.eql(true)
        })
      });
    })
  })
});