import parserFn from './parser-fn.js';
import error from '../source/error.js';

import {
  matchValue
} from '../source/match-value.js';

import {
  describe,
  beforeEach,
  it,
  expect
} from './jasmine';

describe('match value', () => {
  let parser;

  beforeEach(() => {
    parser = parserFn(
      matchValue('blah')
    );
  });

  it('should match a value', () => {
    const {parsed} = parser('blah');

    expect(parsed)
      .toEqual({
        tokens: [],
        consumed: 1,
        result: 'blah'
      });
  });

  it('should preserve errors', () => {
    const {parsed, tokens} = parser('foo');

    expect(parsed)
      .toEqual({
        tokens: [tokens[0]],
        consumed: 0,
        result: error(tokens[0], ['blah'])
      });
  });
});
