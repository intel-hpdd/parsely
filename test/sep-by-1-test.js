import sepBy1 from '../source/sep-by-1.js';
import {
  __,
  curry,
  always
}
from 'intel-fp';
import {
  describe,
  beforeEach,
  it,
  expect,
  jasmine
}
from './jasmine.js';

describe('parser sepBy1', () => {
  var ifToken;

  beforeEach(() => {
    ifToken = curry(2, (elseFn, tokens) => {
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
        result: elseFn(t)
      };
    });
  });

  it('should be curried', () => {
    expect(sepBy1(__, __))
      .toEqual(jasmine.any(Function));
  });

  it('should match a symbol', () => {
    expect(
      sepBy1(
        ifToken(always('bar')),
        ifToken(always(',')),
        [
          {}
        ]
      )
    )
      .toEqual({
        tokens: [],
        suggest: [],
        consumed: 1,
        result: 'bar'
      });
  });

  it('should match a symbol, sep, symbol', () => {
    expect(
      sepBy1(
        ifToken(always('bar')),
        ifToken(always(',')),
        [
          {},
          {},
          {}
        ]
      )
    )
      .toEqual({
        tokens: [],
        suggest: [],
        consumed: 3,
        result: 'bar,bar'
      });
  });

  it('should error on symbol, sep', () => {
    expect(
      sepBy1(
        ifToken(always('bar')),
        ifToken(always(',')),
        [
          {},
          {}
        ]
      )
    )
      .toEqual({
        tokens: [],
        consumed: 2,
        result: new Error('boom!')
      });
  });

  it('should error if nothing is consumed', () => {
    expect(
      sepBy1(
        ifToken(always('bar')),
        ifToken(always(',')),
        []
      )
    )
      .toEqual({
        tokens: [],
        consumed: 0,
        result: new Error('boom!')
      });
  });

  it('should return any seps that were not consumed', () => {
    var calls = 0;

    expect(
      sepBy1(
        tokens => {
          if (calls > 0)
            return {
              tokens,
              consumed: 0,
              result: new Error('boom!')
            };

          calls++;

          return {
            tokens: tokens.slice(1),
            consumed: 1,
            result: 'bar'
          };
        },
        ifToken(always(',')),
        [
          {},
          {},
          {}
        ]
      )
    )
      .toEqual({
        tokens: [
          {}
        ],
        consumed: 2,
        result: new Error('boom!')
      });
  });
});
