// @flow

import getLexer from '../source/get-lexer';

import type { LexerToken, Result } from '../source/index.js';

export default (p: (LexerToken[]) => Result) => (t: string) => {
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
};
