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
