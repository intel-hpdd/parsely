// @flow

import optional from '../source/optional';

import {
  jasmine,
  describe,
  beforeEach,
  it,
  expect
} from './jasmine.js';

describe('parser optional', () => {
  let spy;

  beforeEach(() => {
    spy = jasmine.createSpy('spy');
  });

  it('should be a function', () => {
    expect(optional)
      .toEqual(jasmine.any(Function));
  });

  it('should return an empty string if there are no tokens', () => {
    expect(optional(spy, []))
      .toEqual({
        tokens: [],
        consumed: 0,
        result: ''
      });
  });

  it('should not call the parser if there are no tokens', () => {
    optional(spy, []);

    expect(spy)
      .not
      .toHaveBeenCalled();
  });

  it('should call the parser if there is a token', () => {
    optional(spy, [{}]);

    expect(spy)
      .toHaveBeenCalledOnceWith([{}]);
  });

  it('should return the result of the parser', () => {
    spy.and.returnValue('foo');

    expect(optional(spy, [{}]))
      .toEqual('foo');
  });
});
