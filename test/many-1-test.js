import many1 from '../source/many-1.js';
import {beforeEach, it, expect, jasmine, describe} from './jasmine.js';
import {__, curry} from 'intel-fp';

describe('many one', () => {
  var consumeToken;

  beforeEach(() => {
    consumeToken = curry(2, (fn, tokens) => {
      return {
        tokens: tokens.slice(1),
        consumed: 1,
        result: fn(tokens[0])
      };
    });
  });

  it('should be a function', () => {
    expect(many1).toEqual(jasmine.any(Function));
  });

  it('should be curried', () => {
    expect(many1(__, __)).toEqual(jasmine.any(Function));
  });

  describe('token handling', () => {
    var tokens, res;

    beforeEach(() => {
      tokens = [2, 2, 2, 10, 9, 8, 7];
      res = many1(consumeToken((x) => {
        if (x === 2)
          return x;
        else
          return new Error('x is not 2');
      }), tokens);
    });

    it('should consume until an error is reached', () => {
      expect(res).toEqual({
        tokens: [10, 9, 8, 7],
        consumed: 3,
        result: '222'
      });
    });

    it('should not mutate tokens', () => {
      expect(tokens).toEqual([2, 2, 2, 10, 9, 8, 7]);
    });
  });

  describe('error handling', () => {
    var tokens, res;

    beforeEach(() => {
      tokens = [3, 2, 1];
      res = many1(
        tokens => {

          return {
            tokens,
            consumed: 0,
            result: new Error('x is not 5')
          };
        },
        tokens
      );
    });

    it('should return an Error if the first token produces an error', () => {
      expect(res).toEqual({
        tokens: [3, 2, 1],
        consumed: 0,
        result: new Error('x is not 5')
      });
    });
  });
});
