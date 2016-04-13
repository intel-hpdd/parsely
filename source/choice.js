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

import {curry} from 'intel-fp';

import type {tokens} from './get-lexer';
import type {result} from './token-error.js';

type tokensToResult = (tokens:tokens) => result;

export default curry(2, function choice (choices:Array<tokensToResult>, tokens:tokens):result {
  var out;
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

  if (out)
    return out;

  const errs = errors.pop();

  if (errs.length === 1)
    return errs.pop();

  return errs.reduce((out, result, idx) => {
    return {
      ...out,
      ...result,
      suggest: out.suggest.concat(result.suggest),
      result: new Error(`${out.result.message}${idx === 0 ? '' : ','} ${result.suggest}`)
    };
  }, {suggest: [], result: new Error('Expected one of')});
});
