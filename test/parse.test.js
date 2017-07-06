// @flow

import * as fp from '@iml/fp';
import parse from '../source/parse.js';
import error from '../source/error.js';
import token from '../source/token.js';
import parserFn from './parser-fn.js';
import { jasmine, expect, it, describe, beforeEach } from './jasmine.js';

describe('parse', () => {
  let parser;

  beforeEach(() => {
    const value = x => token(x)('value');
    parser = parserFn(
      parse(() => '')([value(fp.eq('a')), value(fp.eq('b')), value(fp.eq('c'))])
    );
  });

  it('should be a function', () => {
    expect(parse).toEqual(jasmine.any(Function));
  });

  it('should reduce to an output string', () => {
    const { parsed } = parser('a b c');

    expect(parsed).toEqual({
      tokens: [],
      consumed: 3,
      result: 'abc'
    });
  });

  it('should return the first error found', () => {
    const { parsed, tokens } = parser('a e c');

    expect(parsed).toEqual({
      tokens: tokens.slice(1),
      consumed: 1,
      result: error(tokens[1], ['value'])
    });
  });
});
