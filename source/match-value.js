// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import * as fp from '@iml/fp';
import token from './token.js';

import { onError, onSuccess, ParseError } from './error.js';

import type { tokensToResult } from './index.js';

export const matchValue = (name: string): tokensToResult =>
  fp.flow(
    token(fp.eq(name))('value'),
    onError((e: ParseError): ParseError => e.adjust([name]))
  );

export const matchValueTo = (name: string, out: string) =>
  fp.flow(matchValue(name), onSuccess(fp.always(out)));
