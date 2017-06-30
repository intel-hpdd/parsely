// @flow

import * as fp from '@iml/fp';
import manyTill from '../source/many-till.js';
import { ParseError } from '../source/error.js';
import { tokenFactory } from './utils.js';

import { beforeEach, it, expect, jasmine, describe } from './jasmine.js';

describe('many till', () => {
  let consumeToken, token;

  beforeEach(() => {
    token = tokenFactory();

    consumeToken = fn => tokens => {
      return {
        tokens: tokens.slice(1),
        consumed: 1,
        result: fn(tokens[0].content)
      };
    };
  });

  it('should be a function', () => {
    expect(manyTill).toEqual(jasmine.any(Function));
  });

  describe('token handling', () => {
    let tokens, res;

    beforeEach(() => {
      tokens = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
        .map(x => x.toString())
        .map(x => token(x));
      res = manyTill(consumeToken(fp.identity))(
        consumeToken((x): string | ParseError => {
          if (parseInt(x) === 2) return x;
          else return new ParseError(null, ['x is not 2']);
        })
      )(tokens);
    });

    it('should consume until the end fn ', () => {
      expect(res).toEqual({
        tokens: [
          { content: '2', end: 10, name: 'token', start: 9 },
          { content: '1', end: 11, name: 'token', start: 10 }
        ],
        consumed: 8,
        result: '109876543'
      });
    });

    it('should not mutate tokens', () => {
      expect(tokens).toEqual([
        { content: '10', end: 2, name: 'token', start: 0 },
        { content: '9', end: 3, name: 'token', start: 2 },
        { content: '8', end: 4, name: 'token', start: 3 },
        { content: '7', end: 5, name: 'token', start: 4 },
        { content: '6', end: 6, name: 'token', start: 5 },
        { content: '5', end: 7, name: 'token', start: 6 },
        { content: '4', end: 8, name: 'token', start: 7 },
        { content: '3', end: 9, name: 'token', start: 8 },
        { content: '2', end: 10, name: 'token', start: 9 },
        { content: '1', end: 11, name: 'token', start: 10 }
      ]);
    });
  });

  describe('error handling', () => {
    let tokens, res;

    beforeEach(() => {
      tokens = [3, 2, 1].map(x => x.toString()).map(x => token(x));
      res = manyTill(tokens => {
        const [x, ...restTokens] = tokens;

        if (x.content === '3')
          return {
            tokens: restTokens,
            consumed: 1,
            result: x.content
          };
        else
          return {
            tokens,
            consumed: 0,
            result: new ParseError(null, ['x is not 3'])
          };
      })(
        fp.always({
          tokens: [],
          consumed: 2,
          result: new ParseError(null, ['boom!'])
        })
      )(tokens);
    });

    it('should return an Error even if output was consumed', () => {
      expect(res).toEqual({
        tokens: [
          { content: '2', end: 2, name: 'token', start: 1 },
          { content: '1', end: 3, name: 'token', start: 2 }
        ],
        consumed: 1,
        result: new ParseError(null, ['x is not 3'])
      });
    });
  });
});
