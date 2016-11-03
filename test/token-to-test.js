import tokenTo from '../source/token-to.js';
import parserFn from './parser-fn.js';
import error from '../source/error.js';

import {
  describe,
  beforeEach,
  it,
  expect
} from './jasmine';

describe('token to', () => {
  let parser;

  beforeEach(() => {
    parser = parserFn(
      tokenTo(
        'value',
        'bar'
      )
    );
  });

  it('should map input to output', () => {
    const {parsed} = parser('a');

    expect(parsed)
      .toEqual({
        tokens: [],
        consumed: 1,
        result: 'bar'
      });
  });

  it('should preserve errors', () => {
    const {parsed, tokens} = parser('*');

    expect(parsed)
      .toEqual({
        tokens: [tokens[0]],
        consumed: 0,
        result: error(tokens[0], ['value'])
      });
  });
});
