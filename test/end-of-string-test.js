import {describe, expect, it, jasmine, beforeEach} from './jasmine.js';
import parserFn from './parser-fn.js';
import error from '../source/error.js';
import endOfString from '../source/end-of-string.js';


describe('parser end of string', () => {
  var parser;

  beforeEach(() => {
    parser = parserFn(endOfString);
  });

  it('should be a function', () => {
    expect(endOfString).toEqual(jasmine.any(Function));
  });

  it('should return an empty string if there are no tokens', () => {
    const {parsed} = parser('');

    expect(parsed)
      .toEqual({
        tokens: [],
        consumed: 0,
        result: ''
      });
  });

  it('should return an error if there are tokens left', () => {
    const {parsed, tokens} = parser('foo');

    expect(parsed)
      .toEqual({
        tokens: [tokens[0]],
        consumed: 0,
        result: error(tokens[0], ['end of string'])
      });
  });
});
