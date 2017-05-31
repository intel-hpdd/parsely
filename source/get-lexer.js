// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { LexerToken } from './index.js';

export type LexerEntry = {
  name: string,
  pattern: RegExp,
  ignore?: boolean
};

getLexer.whiteSpace = {
  name: 'whiteSpace',
  pattern: /^[ \t\n]+/,
  ignore: true
};

export default getLexer;

function getLexer(types: LexerEntry[]) {
  return (str: string = ''): LexerToken[] => {
    const matches = (function buildTokens(str: string, ptr: number) {
      const arr = [];

      const foundMatch = types.some(type => {
        const match = str.match(type.pattern);

        if (match) {
          const content = match[0];

          if (!type.ignore)
            arr.push({
              content: content,
              name: type.name,
              start: ptr,
              end: ptr + content.length
            });

          const len = content.length;

          ptr += len;
          str = str.substring(len);
        }

        return match;
      });

      if (!foundMatch && str.length) {
        const errContent = consumeError(str);
        const len = errContent.length;

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
    })(str, 0);

    matches.forEach((token: LexerToken, index: number) => {
      if (index > 0) token.prev = matches[index - 1];

      if (index < matches.length - 1) token.next = matches[index + 1];
    });

    return matches;
  };

  function consumeError(str) {
    const foundMatch = types.some(type => str.match(type.pattern));

    return foundMatch || !str.length ? '' : str[0] + consumeError(str.slice(1));
  }
}
