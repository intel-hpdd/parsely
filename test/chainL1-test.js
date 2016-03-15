import chainL1 from '../source/chainL1.js';
import {__, curry, identity, always} from 'intel-fp';
import {describe, beforeEach, it, expect, jasmine} from './jasmine.js';

describe('chain left 1', function () {
  var ifToken;

  beforeEach(function () {
    ifToken = curry(2, function ifToken (fn, tokens) {
      if (!tokens.length)
        return {
          tokens,
          consumed: 0,
          result: new Error('boom!')
        };

      const [t, ...restTokens] = tokens;

      return {
        tokens: restTokens,
        consumed: 1,
        result: fn(t)
      };
    });
  });

  it('should return a function', function () {
    expect(chainL1).toEqual(jasmine.any(Function));
  });

  it('should be curried', function () {
    expect(chainL1(__, __)).toEqual(jasmine.any(Function));
  });

  it('should work for addition and subtraction', function () {
    var adder = chainL1(ifToken(identity), function addOrSubtract (tokens) {
      const [t, ...restTokens] = tokens;

      if (t === '+')
        return {
          tokens: restTokens,
          consumed: 1,
          result: (a, b) => a + b
        };

      if (t === '-')
        return {
          tokens: restTokens,
          consumed: 1,
          result: (a, b) => a - b
        };

      return {
        tokens,
        consumed: 0,
        result: new Error('operation not recognized.')
      };
    });

    expect(adder([
      1,
      '+',
      2,
      '+',
      3,
      '-',
      2
    ])).toEqual({
      tokens: [],
      consumed: 7,
      result: 4
    });
  });

  it('should error if op does not return a function', function () {
    function shouldThrow () {
      chainL1(ifToken(identity), always({result: true}), [1, 2, 3]);
    }

    expect(shouldThrow).toThrow(new Error('operation result must be an Error or a Function, got: boolean'));
  });

  it('should not consume when input was taken', function () {
    var t = [
      1,
      2,
      3
    ];

    var res = chainL1(
      () => {
        return {
          tokens: [2, 3],
          consumed: 1,
          result: new Error('boom!')
        };
      },
      always(identity),
      t
    );

    expect(res).toEqual({
      tokens: [1, 2, 3],
      consumed: 1,
      result: new Error('boom!')
    });
  });

  it('should not consume when no input was taken', function () {
    var t = [
      1,
      2,
      3
    ];

    var res = chainL1(
      () => {
        return {
          tokens: [1, 2, 3],
          consumed: 0,
          result: new Error('boom!')
        };
      },
      always(identity),
    t);

    expect(res).toEqual({
      tokens: [ 1, 2, 3 ],
      consumed: 0,
      result: new Error('boom!') });
  });
});
