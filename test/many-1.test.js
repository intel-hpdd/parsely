// @flow

import many1 from '../source/many-1.js';
import { ParseError } from '../source/error.js';
import { tokenFactory } from './utils.js';

import { beforeEach, it, expect, jasmine, describe } from './jasmine.js';

describe('many one', () => {
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
    expect(many1).toEqual(jasmine.any(Function));
  });

  describe('token handling', () => {
    let tokens, res;

    beforeEach(() => {
      tokens = [2, 2, 2, 10, 9, 8, 7].map(x => x.toString()).map(x => token(x));
      res = many1(
        consumeToken((x): string | ParseError => {
          if (x === '2') return x;
          else return new ParseError(null, ['x is not 2']);
        })
      )(tokens);
    });

    it('should consume until an error is reached', () => {
      expect(res).toEqual({
        tokens: [
          { content: '10', end: 5, name: 'token', start: 3 },
          { content: '9', end: 6, name: 'token', start: 5 },
          { content: '8', end: 7, name: 'token', start: 6 },
          { content: '7', end: 8, name: 'token', start: 7 }
        ],
        consumed: 3,
        result: '222'
      });
    });

    it('should not mutate tokens', () => {
      expect(tokens).toEqual([
        {
          content: '2',
          end: 1,
          name: 'token',
          start: 0
        },
        {
          content: '2',
          end: 2,
          name: 'token',
          start: 1
        },
        {
          content: '2',
          end: 3,
          name: 'token',
          start: 2
        },
        {
          content: '10',
          end: 5,
          name: 'token',
          start: 3
        },
        {
          content: '9',
          end: 6,
          name: 'token',
          start: 5
        },
        {
          content: '8',
          end: 7,
          name: 'token',
          start: 6
        },
        {
          content: '7',
          end: 8,
          name: 'token',
          start: 7
        }
      ]);
    });
  });

  describe('error handling', () => {
    let tokens, res;

    beforeEach(() => {
      tokens = [3, 2, 1].map(x => x.toString()).map(x => token(x));
      res = many1(tokens => {
        return {
          tokens,
          consumed: 0,
          result: new ParseError(null, ['x is not 5'])
        };
      })(tokens);
    });

    it('should return an Error if the first token produces an error', () => {
      expect(res).toEqual({
        tokens: [
          {
            content: '3',
            end: 1,
            name: 'token',
            start: 0
          },
          {
            content: '2',
            end: 2,
            name: 'token',
            start: 1
          },
          {
            content: '1',
            end: 3,
            name: 'token',
            start: 2
          }
        ],
        consumed: 0,
        result: new ParseError(null, ['x is not 5'])
      });
    });
  });
});
