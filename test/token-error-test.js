
import {__, always, identity} from 'intel-fp';
import {describe, beforeEach, it, expect, jasmine} from './jasmine';
import tokenError from '../source/token-error.js';

describe('token error', () => {
  var fn, spy;

  beforeEach(() => {
    spy = jasmine.createSpy('spy');
    fn = tokenError('foo', always('bar'), spy);
  });

  it('should be a function', () => {
    expect(tokenError).toEqual(jasmine.any(Function));
  });

  it('should be curried', () => {
    expect(tokenError(__, __, __, __)).toEqual(jasmine.any(Function));
  });

  it('should return an error if there are no tokens', () => {
    spy.and.callFake(identity);
    expect(fn([])).toEqual({
      tokens: [],
      suggest: ['foo'],
      consumed: 0,
      result: new Error('Expected foo got end of string')
    });
  });

  it('should return the computed output', () => {
    expect(fn([{
      name: 'foo'
    }])).toEqual({
      tokens: [],
      suggest: [],
      consumed: 1,
      result: 'bar'
    });
  });

  it('should not mutate tokens', () => {
    var tokens = [
      {
        name: 'foo'
      },
      {
        name: 'baz'
      }
    ];

    fn(tokens);

    expect(tokens).toEqual([
      {
        name: 'foo'
      },
      {
        name: 'baz'
      }
    ]);
  });

  it('should report mismatched tokens', () => {
    spy.and.callFake(identity);
    expect(fn([
      {
        name: 'baz',
        start: 0
      }
    ]).result.message).toEqual('Expected foo got baz at character 0');
  });

  it('should call the errorFn on error', () => {
    fn([]);

    expect(spy).toHaveBeenCalledOnceWith({
      tokens: [],
      suggest: ['foo'],
      consumed: 0,
      result: new Error('Expected foo got end of string')
    });
  });

  it('should use the return from the errorFn', () => {
    spy.and.callFake(result => ({...result, result: new Error('boomer!')}));

    expect(fn([])).toEqual({
      tokens: [],
      suggest: ['foo'],
      consumed: 0,
      result: new Error('boomer!')
    });
  });
});
