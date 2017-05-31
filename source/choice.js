// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@mfl/fp';

import type { LexerToken, Result, tokensToResult } from './index.js';

const getExpected = fp.flow(
  fp.map(x => x.result),
  fp.map(x => x.expected),
  fp.reduce([])((arr, xs) => arr.concat(xs)),
  fp.uniqBy(fp.identity)
);

export default (choices: tokensToResult[]) => (
  tokens: LexerToken[]
): Result => {
  let out;
  const errors = [];

  choices.some(fn => {
    const parsed = fn(tokens);

    if (parsed.result instanceof Error) {
      errors[parsed.consumed] = errors[parsed.consumed] || [];
      errors[parsed.consumed].push(parsed);
      return false;
    } else {
      out = parsed;
      return true;
    }
  });

  if (out) return out;

  const errs = errors.pop();
  const err = errs.slice(-1).pop();

  if (errs.length === 1) return err;

  const expected = getExpected(errs);

  if (expected.length === 1) return err;

  return {
    ...err,
    result: err.result.adjust(expected)
  };
};
