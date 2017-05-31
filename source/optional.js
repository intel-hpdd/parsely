// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { LexerToken, Result, tokensToResult } from './index.js';

export default (p: tokensToResult) => (tokens: LexerToken[]): Result => {
  if (!tokens.length)
    return {
      tokens,
      consumed: 0,
      result: ''
    };

  return p(tokens);
};
