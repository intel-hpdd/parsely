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
import type {lexerTokens, result} from './index.js';

type stringToString = (content:string) => string;

export default curry(3,
  function match (content:string, outFn:stringToString, tokens:lexerTokens):result {
    if (tokens.length === 0)
      return {
        tokens,
        suggest: [content],
        consumed: 0,
        result: new Error(`Expected ${content} got end of string`)
      };

    const [t, ...tokensRest] = tokens;

    if (t.name === 'value' && t.content === content)
      return {
        tokens: tokensRest,
        suggest: [],
        consumed: 1,
        result: outFn(t.content)
      };

    return {
      tokens,
      suggest: [content],
      consumed: 0,
      result: new Error(`Expected ${content} got ${t.content} at character ${t.start}`)
    };
  }
);
