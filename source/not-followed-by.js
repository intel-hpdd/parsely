// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import error from './error.js';

import type { LexerToken, Result, tokensToResult } from './index.js';

export default (p: tokensToResult) => (tokens: LexerToken[]): Result => {
  const parsed = p(tokens);

  if (parsed.result instanceof Error)
    return {
      tokens,
      consumed: 0,
      result: ''
    };
  else
    return {
      tokens,
      consumed: 0,
      result: error(tokens[0], ['a non-match'])
    };
};
