// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { LexerToken, Result, tokensToResult } from './index.js';

export default (symbolFn: tokensToResult) => (tokens: LexerToken[]): Result => {
  let err;
  let out = {
    tokens,
    consumed: 0,
    result: ''
  };
  let atLeastOnce = false;

  while (true) {
    const parsed = symbolFn(out.tokens);

    if (parsed.result instanceof Error) {
      err = {
        ...parsed,
        consumed: out.consumed + parsed.consumed,
        tokens: out.tokens
      };
      break;
    } else {
      atLeastOnce = true;
      out = {
        tokens: parsed.tokens,
        consumed: out.consumed + parsed.consumed,
        result: out.result.concat(parsed.result)
      };
    }
  }

  // $FlowFixMe: Error is guaranteed to be set if atLeastOnce is false
  return !atLeastOnce ? err : out;
};
