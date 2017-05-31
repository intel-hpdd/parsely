// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { LexerToken, Result, tokensToResult } from './index.js';

export default (symbolFn: tokensToResult) => (endFn: tokensToResult) => (
  tokens: LexerToken[]
): Result => {
  let err;
  let out = {
    tokens,
    consumed: 0,
    result: ''
  };

  while (true) {
    let parsed = symbolFn(out.tokens);

    if (parsed.result instanceof Error) {
      err = {
        ...parsed,
        consumed: out.consumed + parsed.consumed,
        tokens: out.tokens
      };
      break;
    } else {
      out = {
        tokens: parsed.tokens,
        consumed: out.consumed + parsed.consumed,
        result: out.result.concat(parsed.result)
      };
    }

    parsed = endFn(out.tokens);

    if (!(parsed.result instanceof Error)) break;
  }

  return err || out;
};
