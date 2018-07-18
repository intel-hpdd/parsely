// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { LexerToken, Result } from './index.js';

const defaultT = {
  start: Infinity,
  end: Infinity,
  name: '',
  content: ''
};

function getMessage(t: LexerToken, expected: string[]): string {
  let str = 'Expected';

  str +=
    expected.length > 1 ? ` one of ${expected.join(', ')}` : ` ${expected[0]}`;

  str += isFinite(t.start)
    ? ` got ${t.content} at character ${t.start}`
    : ' got end of string';

  return str;
}

export class ParseError extends Error {
  expected: string[];
  start: number;
  end: number;
  adjust: (x: string[]) => ParseError;
  constructor(t: ?LexerToken, expected: string[]) {
    t = t || defaultT;

    super(getMessage(t, expected));

    this.start = t.start;
    this.end = t.end;
    this.expected = expected;
    this.adjust = x => new ParseError(t, x);
  }
}

export default (t: ?LexerToken, expected: string[]): ParseError =>
  new ParseError(t, expected);

export const onSuccess = (fn: (s: string) => string | ParseError) => (
  result: Result
): Result => {
  if (!(result.result instanceof Error))
    return {
      ...result,
      result: fn(result.result)
    };
  else return result;
};

export const onError = (fn: (e: ParseError) => ParseError | string) => (
  result: Result
): Result => {
  if (result.result instanceof Error)
    return {
      ...result,
      result: fn(result.result)
    };
  else return result;
};
