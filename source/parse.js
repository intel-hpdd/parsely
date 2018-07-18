// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { LexerToken, Result, tokensToResult } from './index.js';

export default (initFn: () => string) => (fns: tokensToResult[]) => (
  tokens: LexerToken[]
): Result => {
  const out = {
    tokens,
    consumed: 0,
    result: initFn()
  };

  return fns.reduce((curr, fn) => {
    if (curr.result instanceof Error) return curr;

    const result = fn(curr.tokens);

    if (result.result instanceof Error)
      return {
        ...result,
        consumed: curr.consumed + result.consumed
      };
    else
      return {
        ...result,
        consumed: curr.consumed + result.consumed,
        // $FlowFixMe This has been checked to be string above
        result: curr.result.concat(result.result)
      };
  }, out);
};
