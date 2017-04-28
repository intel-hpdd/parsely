// @flow

import type { LexerToken } from '../source/index.js';

export const tokenFactory = (start: number = 0) => (
  content: string,
  name: string = 'token'
): LexerToken => ({
  content,
  name,
  start,
  end: (start += content.length)
});
