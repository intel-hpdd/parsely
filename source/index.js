// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

export { default as choice } from './choice.js';
export { default as endOfString } from './end-of-string.js';
export { default as getLexer } from './get-lexer.js';
export { default as manyTill } from './many-till.js';
export { default as many1 } from './many-1.js';
export { default as optional } from './optional.js';
export { default as parse } from './parse.js';
export { default as sepBy1 } from './sep-by-1.js';
export { default as token } from './token.js';
export { default as sepByInfinity } from './sep-by-infinity.js';
export { default as notFollowedBy } from './not-followed-by.js';
export { matchValue, matchValueTo } from './match-value.js';
export { default as tokenTo } from './token-to.js';

import parse from './parse.js';
export const parseStr = parse((): string => '');

import { ParseError } from './error';
export { ParseError, onSuccess, onError, default as error } from './error';

export type Result = {
  tokens: LexerToken[],
  consumed: number,
  result: ParseError | string
};

export type tokensToResult = (LexerToken[]) => Result;

export type LexerToken = {
  content: string,
  name: string,
  start: number,
  end: number,
  next?: LexerToken,
  prev?: LexerToken
};
