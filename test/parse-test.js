import parse from '../source/parse';
import {jasmine, expect, it, describe, beforeEach} from './jasmine.js';

import {__, always} from 'intel-fp';

describe('parser parse', () => {
  var token;

  beforeEach(() => {
    token = (result) => {
      return () => ({ result, consumed: 1, tokens: [] });
    };
  });

  it('should be a function', () => {
    expect(parse).toEqual(jasmine.any(Function));
  });

  it('should be curried', () => {
    expect(parse(__, __)).toEqual(jasmine.any(Function));
  });

  it('should reduce to an output string', () => {
    const out = parse(always(''),
      [
        token('a'),
        token('b'),
        token('c')
      ],
      []
    );

    expect(out).toEqual({
      tokens: [],
      consumed: 3,
      result: 'abc'
    });
  });

  it('should return the first error found', () => {
    var out = parse(always(''), [
      token('a'),
      () => ({ result: new Error('boom!'), consumed: 0, tokens: [] }),
      token('b')
    ], []);

    expect(out).toEqual({ result: new Error('boom!'), consumed: 1, tokens: [] });
  });

  it('should parse arrays', () => {
    var out = parse(() => [],
      [
        token('a'),
        token('b'),
        token('c')
      ],
      []
    );

    expect(out).toEqual({
      tokens: [],
      consumed: 3,
      result: ['a', 'b', 'c']
    });
  });
});
