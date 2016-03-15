import optional from '../source/optional';
import {__} from 'intel-fp';
import {jasmine, describe, beforeEach, it, expect} from './jasmine.js';

describe('parser optional', function () {
  var spy;

  beforeEach(function () {
    spy = jasmine.createSpy('spy');
  });

  it('should be a function', function () {
    expect(optional).toEqual(jasmine.any(Function));
  });

  it('should be curried', function () {
    expect(optional(__)).toEqual(jasmine.any(Function));
  });

  it('should return an empty string if there are no tokens', function () {
    expect(optional(spy, [])).toEqual({
      tokens: [],
      consumed: 0,
      result: ''
    });
  });

  it('should not call the parser if there are no tokens', function () {
    optional(spy, []);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should call the parser if there is a token', function () {
    optional(spy, [{}]);

    expect(spy).toHaveBeenCalledOnceWith([{}]);
  });

  it('should return the result of the parser', function () {
    spy.and.returnValue('foo');

    expect(optional(spy, [{}])).toEqual('foo');
  });
});
