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

import {curry, identity} from 'intel-fp';

import type {tokens} from './get-lexer.js';
import type {result} from './token-error.js';

export default curry(3, function chainL1 (parse:Function, operation:Function, tokens:tokens):result {
  var err;
  var fn = identity;
  var out = {
    tokens,
    suggest: [],
    consumed: 0,
    result: ''
  };

  while (true) {
    var parsed = parse(out.tokens);

    if (isError(parsed.result)) {
      err = { ...parsed, consumed: out.consumed + parsed.consumed, tokens };
      break;
    }

    var result = fn(parsed.result);

    out = { ...parsed, consumed: out.consumed + parsed.consumed, result };

    var parsedFn = operation(out.tokens);

    if (isError(parsedFn.result))
      break;

    throwIfBadType(parsedFn.result);

    out = { ...parsedFn, consumed: out.consumed + parsedFn.consumed, result: out.result };

    fn = curry(2, parsedFn.result)(out.result);
  }

  return err ? err : out;
});

function throwIfBadType (x) {
  if (typeof x !== 'function')
    throw new Error('operation result must be an Error or a Function, got: ' + typeof x);
}

function isError (x) {
  return x instanceof Error;
}
