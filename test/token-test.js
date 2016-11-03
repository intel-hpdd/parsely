// @flow

import * as fp from 'intel-fp';
import token from '../source/token.js';
import parserFn from './parser-fn.js';
import error from '../source/error.js';

import {
  describe,
  beforeEach,
  it,
  expect,
  jasmine
} from './jasmine';

describe('token', () => {
  let value,
    parser;

  beforeEach(() => {
    value = token(fp.always(true), 'value');

    parser = parserFn(value);
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
