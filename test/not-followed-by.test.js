// @flow

import notFollowedBy from '../source/not-followed-by.js';

import { jasmine, describe, beforeEach, it, expect } from './jasmine.js';

describe('parser not followed by', () => {
  let spy;

  beforeEach(() => {
    spy = jasmine.createSpy('spy');
  });

  it('should be a function', () => {
    expect(notFollowedBy).toEqual(jasmine.any(Function));
  });

  it('should return an error if the parser succeeds', () => {
    spy.and.returnValue({
      result: ''
    });

    expect(notFollowedBy(spy, [])).toEqual({
      tokens: [],
      consumed: 0,
      result: new Error('Expected a non-match got end of string')
    });
  });

  it('should return success if the parser fails', () => {
    spy.and.returnValue({
      result: new Error('oh noes!')
    });

    expect(notFollowedBy(spy, [])).toEqual({
      tokens: [],
      consumed: 0,
      result: ''
    });
  });
});
