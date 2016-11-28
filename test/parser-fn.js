// @flow

import * as fp from 'intel-fp';
import getLexer from '../source/get-lexer';

import type {
  lexerTokens,
  result
} from '../source/index.js';

import type {
  lexerType
} from '../source/get-lexer.js';

export default fp.curry2((p:(t:lexerTokens) => result, t:string) => {
  const lexer = getLexer([
    {
      name: 'whiteSpace',
      pattern: /^[ \t\n]+/,
      ignore: true
    },
    {
      name: 'join',
      pattern: /^and/
    },
    {
      name: 'value',
      pattern: /^[a-zA-z]+/
    },
    {
      name: 'equals',
      pattern: /^=/
    }
  ]);

  const tokens = lexer(t);
  const parsed = p(tokens);

  return {
    tokens,
    parsed
  };
});