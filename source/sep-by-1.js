// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { LexerToken, Result, tokensToResult } from './index.js';

export default (symbolFn: tokensToResult) => (sepFn: tokensToResult) => (
  tokens: LexerToken[]
): Result => {
  let err;
  let out = {
    tokens,
    consumed: 0,
    result: ''
  };

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
      out = {
        tokens: parsed.tokens,
        consumed: out.consumed + parsed.consumed,
        result: out.result.concat(parsed.result)
      };
    }

    const sepParsed = sepFn(out.tokens);

    if (sepParsed.result instanceof Error) {
      out = {
        ...out,
        tokens: out.tokens.slice(sepParsed.consumed),
        consumed: out.consumed + sepParsed.consumed
      };
      break;
    } else {
      out = {
        tokens: sepParsed.tokens,
        consumed: out.consumed + sepParsed.consumed,
        result: out.result.concat(sepParsed.result)
      };
    }
  }

  return err ? err : out;
};
