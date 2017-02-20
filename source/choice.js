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

import * as fp from '@iml/fp';

import type { lexerTokens, result, tokensToResult } from './index.js';

const getExpected = fp.flow(
  fp.map(x => x.result),
  fp.map(x => x.expected),
  fp.reduce([], (arr, xs) => arr.concat(xs)),
  fp.uniqBy(fp.identity)
);

export default fp.curry2((
  choices: tokensToResult[],
  tokens: lexerTokens
): result => {
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
});
