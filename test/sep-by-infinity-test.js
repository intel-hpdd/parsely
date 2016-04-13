import sepByInfinity from '../source/sep-by-infinity.js';
import {__, noop} from 'intel-fp';
import {jasmine, expect, it, describe} from './jasmine.js';

describe('sep by infinity', () => {
  it('should be curried', () => {
    expect(sepByInfinity(__, __, __)).toEqual(jasmine.any(Function));
  });

  it('should error if symbolFn does not parse', () => {
    const result = sepByInfinity(
      tokens => ({
        tokens,
        consumed: 0,
        result: new Error('symbolFn did not parse')
      }),
      noop,
      [
        {},
        {}
      ]
    );

    expect(result).toEqual({
      tokens: [
        {},
        {}
      ],
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
      [
        {},
        {}
      ]
    );

    expect(result).toEqual({
      tokens: [
        {},
        {}
      ],
      consumed: 0,
      result: new Error('sepFn did not parse')
    });
  });

  it('should match multiples and still error', () => {
    var cnt = 1;

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
      [
        {},
        {},
        {}
      ]
    );

    expect(result).toEqual({
      tokens: [
        {}
      ],
      consumed: 3,
      result: new Error('symbolFn did not parse')
    });
  });
});
