// @flow

import * as fp from '@mfl/fp';
import choice from '../source/choice.js';
import token from '../source/token.js';
import error from '../source/error.js';
import parse from '../source/parse.js';
import parserFn from './parser-fn.js';

import { beforeEach, describe, expect, it, jasmine } from './jasmine.js';

describe('parser choice', () => {
  it('should return a function', () => {
    expect(choice).toEqual(jasmine.any(Function));
  });

  describe('finding choices', () => {
    let parser;

    beforeEach(() => {
      parser = parserFn(
        choice([
          token(fp.eq('a'))('value'),
          token(fp.eq('b'))('value'),
          token(fp.always(true))('equals')
        ])
      );
    });

    it('should match a', () => {
      const { parsed } = parser('a');

      expect(parsed).toEqual({
        tokens: [],
        consumed: 1,
        result: 'a'
      });
    });

    it('should match b', () => {
      const { parsed } = parser('b');

      expect(parsed).toEqual({
        tokens: [],
        consumed: 1,
        result: 'b'
      });
    });

    it('should return an error', () => {
      const { parsed, tokens } = parser('c');

      expect(parsed).toEqual({
        tokens: [tokens[0]],
        consumed: 0,
        result: error(tokens[0], ['value', 'equals'])
      });
    });

    it('should return the most specific error', () => {
      const choices = choice([
        parse(() => '')([
          token(fp.eq('a'))('value'),
          token(fp.always(true))('equals'),
          token(fp.always(true))('join')
        ]),
        token(fp.eq('b'))('value')
      ]);

      const { parsed } = parserFn(choices)('a =');

      expect(parsed).toEqual({
        tokens: [],
        consumed: 2,
        result: error(null, ['join'])
      });
    });
  });
});
