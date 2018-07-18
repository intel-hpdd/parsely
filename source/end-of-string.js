// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import error from './error.js';

import type { LexerToken, Result } from './index.js';

export default function endOfString(tokens: LexerToken[]): Result {
  return {
    tokens,
    consumed: 0,
    result: tokens.length === 0 ? '' : error(tokens[0], ['end of string'])
  };
}
