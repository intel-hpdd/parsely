// @flow

import * as fp from '@iml/fp';
import manyTill from '../source/many-till.js';

import { beforeEach, it, expect, jasmine, describe } from './jasmine.js';

describe('many till', () => {
  let consumeToken;

  beforeEach(() => {
    consumeToken = fp.curry2((fn, tokens) => {
      return {
        tokens: tokens.slice(1),
        consumed: 1,
        result: fn(tokens[0])
      };
    });
  });

  it('should be a function', () => {
    expect(manyTill).toEqual(jasmine.any(Function));
  });

  describe('token handling', () => {
    let tokens, res;

    beforeEach(() => {
      tokens = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
      res = manyTill(
        consumeToken(fp.identity),
        consumeToken((x): number | Error => {
          if (x === 2) return x;
          else return new Error('x is not 2');
        }),
        tokens
      );
    });

    it('should consume until the end fn ', () => {
      expect(res).toEqual({
        tokens: [2, 1],
        consumed: 8,
        result: '109876543'
      });
    });

    it('should not mutate tokens', () => {
      expect(tokens).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1]);
    });
  });

  describe('error handling', () => {
    let tokens, res;

    beforeEach(() => {
      tokens = [3, 2, 1];
      res = manyTill(
        tokens => {
          const [x, ...restTokens] = tokens;

          if (x === 3)
            return {
              tokens: restTokens,
              consumed: 1,
              result: x
            };
          else
            return {
              tokens,
              consumed: 0,
              result: new Error('x is not 3')
            };
        },
        fp.always({
          result: new Error('boom!')
        }),
        tokens
      );
    });

    it('should return an Error even if output was consumed', () => {
      expect(res).toEqual({
        tokens: [2, 1],
        consumed: 1,
        result: new Error('x is not 3')
      });
    });
  });
});
