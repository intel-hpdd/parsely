
import {__, always} from 'intel-fp';
import {describe, beforeEach, it, expect, jasmine} from './jasmine';
import token from '../source/token.js';
import parserFn from './parser-fn.js';
import error from '../source/error.js';

describe('token', () => {
  var value, parser;

  beforeEach(() => {
    value = token(always(true), 'value');

    parser = parserFn(value);
  });

  it('should be curried', () => {
    expect(token(__, __, __)).toEqual(jasmine.any(Function));
  });

  it('should return an error if there are no tokens', () => {
    const {parsed} = parser('');

    expect(parsed)
      .toEqual({
        tokens: [],
        consumed: 0,
        result: error(null, ['value'])
      });
  });

  it('should return the computed output', () => {
    const {parsed} = parser('foo');

    expect(parsed)
      .toEqual({
        tokens: [],
        consumed: 1,
        result: 'foo'
      });
  });

  it('should report errors on content mismatch', () => {
    const {parsed, tokens} = parserFn(
      token(x => x === 'bar', 'value'),
      'foo'
    );

    expect(parsed)
      .toEqual({
        tokens: [tokens[0]],
        consumed: 0,
        result: error(tokens[0], ['value'])
      });
  });

  it('should report errors', () => {
    const {parsed, tokens} = parser('*');

    expect(parsed)
      .toEqual({
        tokens: [tokens[0]],
        consumed: 0,
        result: error(tokens[0], ['value'])
      });
  });
});
