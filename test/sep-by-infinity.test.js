// @flow

import * as fp from '@iml/fp';
import sepByInfinity from '../source/sep-by-infinity.js';

import { expect, it, describe } from './jasmine.js';

describe('sep by infinity', () => {
  it('should error if symbolFn does not parse', () => {
    const result = sepByInfinity(
      tokens => ({
        tokens,
        consumed: 0,
        result: new Error('symbolFn did not parse')
      }),
      fp.noop,
      [{}, {}]
    );

    expect(result).toEqual({
      tokens: [{}, {}],
      consumed: 0,
      result: new Error('symbolFn did not parse')
    });
  });

  it('should error if sepFn does not parse', () => {
    const result = sepByInfinity(
      tokens => ({
        tokens,
        consumed: 0,
        result: 'a'
      }),
      tokens => ({
        tokens,
        consumed: 0,
        result: new Error('sepFn did not parse')
      }),
      [{}, {}]
    );

    expect(result).toEqual({
      tokens: [{}, {}],
      consumed: 0,
      result: new Error('sepFn did not parse')
    });
  });

  it('should match multiples and still error', () => {
    let cnt = 1;

    const result = sepByInfinity(
      tokens => ({
        tokens: tokens.slice(1),
        consumed: 1,
        result: cnt-- ? 'a' : new Error('symbolFn did not parse')
      }),
      tokens => ({
        tokens: tokens.slice(1),
        consumed: 1,
        result: ','
      }),
      [{}, {}, {}]
    );

    expect(result).toEqual({
      tokens: [{}],
      consumed: 3,
      result: new Error('symbolFn did not parse')
    });
  });
});
