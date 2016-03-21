
import {__, always} from 'intel-fp';
import {describe, beforeEach, it, expect, jasmine} from './jasmine';
import token from '../source/token';

describe('parser token', () => {
  var fn;

  beforeEach(() => {
    fn = token('foo', always('bar'));
  });

  it('should be a function', () => {
    expect(token).toEqual(jasmine.any(Function));
  });

  it('should be curried', () => {
    expect(token(__, __)).toEqual(jasmine.any(Function));
  });

  it('should return an error if there are no tokens', () => {
    expect(fn([]).result.message).toBe('Expected foo got end of string');
  });

  it('should return the computed output', () => {
    expect(fn([{
      name: 'foo'
    }])).toEqual({
      tokens: [],
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
    expect(fn([
      {
        name: 'baz',
        character: 0
      }
    ]).result.message).toEqual('Expected foo got baz at character 0');
  });
});
