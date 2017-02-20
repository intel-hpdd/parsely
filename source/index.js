// @flow

//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

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

export type result = {
  tokens: lexerTokens,
  consumed: number,
  result: ParseError | string
};

export type tokensToResult = (tokens: lexerTokens) => result;

export type lexerToken = {
  content: string,
  name: string,
  start: number,
  end: number,
  next?: lexerToken,
  prev?: lexerToken
};

export type lexerTokens = Array<lexerToken>;
