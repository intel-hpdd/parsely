// @flow

import optional from '../source/optional';

import { jasmine, describe, beforeEach, it, expect } from './jasmine.js';
import { tokenFactory } from './utils.js';

describe('parser optional', () => {
  let spy, token;

  beforeEach(() => {
    spy = jasmine.createSpy('spy');
    token = tokenFactory()('foo');
  });

  it('should be a function', () => {
    expect(optional).toEqual(jasmine.any(Function));
  });

  it('should return an empty string if there are no tokens', () => {
    expect(optional(spy)([])).toEqual({
      tokens: [],
      consumed: 0,
      result: ''
    });
  });

  it('should not call the parser if there are no tokens', () => {
    optional(spy, []);

    expect(spy).not.toHaveBeenCalled();
  });

  it('should call the parser if there is a token', () => {
    optional(spy)([token]);

    expect(spy).toHaveBeenCalledOnceWith([token]);
  });

  it('should return the result of the parser', () => {
    spy.and.returnValue('foo');

    expect(optional(spy)([token])).toEqual('foo');
  });
});
