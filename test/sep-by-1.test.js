// @flow

import * as fp from '@iml/fp';
import sepBy1 from '../source/sep-by-1.js';
import { ParseError } from '../source/error.js';
import { tokenFactory } from './utils.js';

import { describe, beforeEach, it, expect } from './jasmine.js';

describe('parser sepBy1', () => {
  let ifToken, token;

  beforeEach(() => {
    ifToken = elseFn => tokens => {
      if (!tokens.length)
        return {
          tokens,
          consumed: 0,
          result: new ParseError(null, ['boom!'])
        };

      const [t, ...restTokens] = tokens;

      return {
        tokens: restTokens,
        consumed: 1,
        result: elseFn(t)
      };
    };

    token = tokenFactory();
  });

  it('should match a symbol', () => {
    expect(
      sepBy1(ifToken(fp.always('bar')))(ifToken(fp.always(',')))([token('a')])
    ).toEqual({
      tokens: [],
      consumed: 1,
      result: 'bar'
    });
  });

  it('should match a symbol, sep, symbol', () => {
    expect(
      sepBy1(ifToken(fp.always('bar')))(ifToken(fp.always(',')))([
        token('a'),
        token('b'),
        token('c')
      ])
    ).toEqual({
      tokens: [],
      consumed: 3,
      result: 'bar,bar'
    });
  });

  it('should error on symbol, sep', () => {
    expect(
      sepBy1(ifToken(fp.always('bar')))(ifToken(fp.always(',')))([
        token('a'),
        token('b')
      ])
    ).toEqual({
      tokens: [],
      consumed: 2,
      result: new ParseError(null, ['boom!'])
    });
  });

  it('should error if nothing is consumed', () => {
    expect(
      sepBy1(ifToken(fp.always('bar')))(ifToken(fp.always(',')))([])
    ).toEqual({
      tokens: [],
      consumed: 0,
      result: new ParseError(null, ['boom!'])
    });
  });

  it('should return any seps that were not consumed', () => {
    let calls = 0;

    expect(
      sepBy1(tokens => {
        if (calls > 0)
          return {
            tokens,
            consumed: 0,
            result: new ParseError(null, ['boom!'])
          };

        calls++;

        return {
          tokens: tokens.slice(1),
          consumed: 1,
          result: 'bar'
        };
      })(ifToken(fp.always(',')))([token('a'), token('b'), token('c')])
    ).toEqual({
      tokens: [
        {
          content: 'c',
          name: 'token',
          start: 2,
          end: 3
        }
      ],
      consumed: 2,
      result: new ParseError(null, ['boom!'])
    });
  });
});
