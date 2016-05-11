import parse from '../source/parse.js';
import error from '../source/error.js';
import token from '../source/token.js';
import parserFn from './parser-fn.js';
import {jasmine, expect, it, describe, beforeEach} from './jasmine.js';
import {__, always, eq} from 'intel-fp';

describe('parse', () => {
  var parser;

  beforeEach(() => {
    const value = token(__, 'value');
    parser = parserFn(
      parse(
        always(''),
        [
          value(eq('a')),
          value(eq('b')),
          value(eq('c'))
        ]
      )
    );
  });

  it('should be a function', () => {
    expect(parse).toEqual(jasmine.any(Function));
  });

  it('should be curried', () => {
    expect(parse(__, __, __)).toEqual(jasmine.any(Function));
  });

  it('should reduce to an output string', () => {
    const {parsed} = parser('a b c');

    expect(parsed)
      .toEqual({
        tokens: [],
        consumed: 3,
        result: 'abc'
      });
  });

  it('should return the first error found', () => {
    const {parsed, tokens} = parser('a e c');

    expect(parsed)
      .toEqual({
        tokens: tokens.slice(1),
        consumed: 1,
        result: error(tokens[1], ['value'])
      });
  });
});
