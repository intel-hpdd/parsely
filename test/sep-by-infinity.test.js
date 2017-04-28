// @flow

import sepByInfinity from '../source/sep-by-infinity.js';
import { ParseError } from '../source/error.js';
import { tokenFactory } from './utils.js';

import { expect, it, describe, beforeEach } from './jasmine.js';

describe('sep by infinity', () => {
  let token;

  beforeEach(() => {
    token = tokenFactory();
  });

  it('should error if symbolFn does not parse', () => {
    const result = sepByInfinity(tokens => ({
      tokens,
      consumed: 0,
      result: new ParseError(null, ['symbolFn did not parse'])
    }))(() => ({ tokens: [], consumed: 0, result: '' }))([
      token('a'),
      token('b')
    ]);

    expect(result).toEqual({
      tokens: [
        {
          content: 'a',
          end: 1,
          start: 0,
          name: 'token'
        },
        {
          content: 'b',
          end: 2,
          start: 1,
          name: 'token'
        }
      ],
      consumed: 0,
      result: new ParseError(null, ['symbolFn did not parse'])
    });
  });

  it('should error if sepFn does not parse', () => {
    const result = sepByInfinity(tokens => ({
      tokens,
      consumed: 0,
      result: 'a'
    }))(tokens => ({
      tokens,
      consumed: 0,
      result: new ParseError(null, ['sepFn did not parse'])
    }))([token('a'), token('b')]);

    expect(result).toEqual({
      tokens: [
        {
          content: 'a',
          end: 1,
          name: 'token',
          start: 0
        },
        {
          content: 'b',
          start: 1,
          name: 'token',
          end: 2
        }
      ],
      consumed: 0,
      result: new ParseError(null, ['sepFn did not parse'])
    });
  });

  it('should match multiples and still error', () => {
    let cnt = 1;

    const result = sepByInfinity(tokens => ({
      tokens: tokens.slice(1),
      consumed: 1,
      result: cnt-- ? 'a' : new ParseError(null, ['symbolFn did not parse'])
    }))(tokens => ({
      tokens: tokens.slice(1),
      consumed: 1,
      result: ','
    }))([token('a'), token('b'), token('c')]);

    expect(result).toEqual({
      tokens: [
        {
          content: 'c',
          end: 3,
          start: 2,
          name: 'token'
        }
      ],
      consumed: 3,
      result: new ParseError(null, ['symbolFn did not parse'])
    });
  });
});
