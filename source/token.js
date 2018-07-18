// @flow

//
// Copyright (c) 2017 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import error from './error.js';

import type { LexerToken, Result } from './index.js';

export default (contentFn: string => boolean) => (name: string) => (
  tokens: LexerToken[]
): Result => {
  if (tokens.length === 0)
    return {
      tokens,
      consumed: 0,
      result: error(null, [name])
    };

  const [t, ...tokensRest] = tokens;

  if (t.name === name && contentFn(t.content))
    return {
      tokens: tokensRest,
      consumed: 1,
      result: t.content
    };

  return {
    tokens,
    consumed: 0,
    result: error(t, [name])
  };
};
