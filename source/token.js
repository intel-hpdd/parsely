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

import type {tokens} from './get-lexer';

import {lensProp, view, curry} from 'intel-fp';

const viewName = view(lensProp('name'));

export default curry(3, function token (name:string, outFn:Function, tokens: tokens) {
  if (tokens.length === 0)
    return {
      tokens,
      consumed: 0,
      result: new Error(`Expected ${name} got end of string`)
    };

  const [t, ...tokensRest] = tokens;

  if (viewName(t) === name)
    return {
      tokens: tokensRest,
      consumed: 1,
      result: outFn(t)
    };

  return {
    tokens,
    consumed: 0,
    result: new Error(`Expected ${name} got ${viewName(t)} at character ${t.character}`)
  };
});
