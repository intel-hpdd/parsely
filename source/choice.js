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

import type {lexerTokens, result, tokensToResult} from './index.js';

export default curry(2, function choice (choices:Array<tokensToResult>, tokens:lexerTokens):result {
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
  const err = errs.slice(-1).pop();

  if (errs.length === 1)
    return err;

  const suggestions = Array.from(errs.reduce((set, err) => {
    err.suggest.forEach(x => set.add(x));
    return set;
  }, new Set()));

  if (suggestions.length === 1)
    return err;

  return {
    ...err,
    suggest: suggestions,
    result: new Error(`Expected one of ${suggestions.join(', ')}`)
  };
});
