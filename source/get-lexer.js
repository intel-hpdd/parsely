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


import type {lexerTokens} from './index.js';

type lexerType = {
  name: string;
  pattern: RegExp;
  ignore?: boolean;
};

getLexer.whiteSpace = {
  name: 'whiteSpace',
  pattern: /^[ \t\n]+/,
  ignore: true
};

export default getLexer;

function getLexer (types:Array<lexerType>):Function {
  return function tokenize (str:string):lexerTokens {
    str = str || '';

    var matches = (function buildTokens (str, ptr) {
      var arr = [];

      var foundMatch = types.some(function findMatch (type) {
        var match = str.match(type.pattern);

        if (match) {
          var content = match[0];

          if (!type.ignore)
            arr.push({
              content: content,
              name: type.name,
              start: ptr,
              end: ptr + content.length
            });

          var len = content.length;

          ptr += len;
          str = str.substring(len);
        }

        return match;
      });

      if (!foundMatch && str.length) {
        var errContent = consumeError(str);
        var len = errContent.length;

        arr.push({
          content: errContent,
          name: 'error',
          start: ptr,
          end: ptr + len
        });

        ptr += len;
        str = str.substring(len);
      }

      return str.length ? arr.concat(buildTokens(str, ptr)) : arr;
    }(str, 0));

    matches.forEach(function doubleLinkedList (token, index) {
      if (index > 0)
        token.prev = matches[index - 1];

      if (index < matches.length - 1)
        token.next = matches[index + 1];
    });

    return matches;
  };

  function consumeError (str) {
    var foundMatch = types.some(function findMatch (type) {
      return str.match(type.pattern);
    });

    return foundMatch || !str.length ? '' : str[0] + consumeError(str.slice(1));
  }
}
