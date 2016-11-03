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

import * as fp from 'intel-fp';

import type {
  lexerToken,
  result
} from './index.js';

const defaultT = {
  start:Infinity,
  end:Infinity,
  name: '',
  content: ''
};

function getMessage (t:lexerToken, expected:string[]):string {
  let str = 'Expected';

  str += expected.length > 1 ?
    ` one of ${expected.join(', ')}` :
    ` ${expected[0]}`;

  str += isFinite(t.start) ?
    ` got ${t.content} at character ${t.start}` :
    ' got end of string';

  return str;
}

export class ParseError extends Error {
  expected:Array<string>;
  start:number;
  end:number;
  adjust:(x:Array<string>) => ParseError;
  constructor (t:?lexerToken, expected:Array<string>) {
    t = t || defaultT;

    super(getMessage(t, expected));

    this.start = t.start;
    this.end = t.end;
    this.expected = expected;
    this.adjust = x => new ParseError(t, x);
  }
}

export default (t:?lexerToken, expected:string[]):ParseError => new ParseError(t, expected);

export const onSuccess = fp.curry2((fn:(s:string) => (string | ParseError), result:result):result => {
  if (!(result.result instanceof Error))
    return {
      ...result,
      result: fn(result.result)
    };
  else
    return result;
});

export const onError = fp.curry2((fn:(e:ParseError) => (ParseError | string), result:result):result => {
  if (result.result instanceof Error)
    return {
      ...result,
      result: fn(result.result)
    };
  else
    return result;
});
