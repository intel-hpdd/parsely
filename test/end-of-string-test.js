import endOfString from '../source/end-of-string.js';
import {describe, expect, it, jasmine} from './jasmine.js';


describe('parser end of string', () => {
  it('should be a function', () => {
    expect(endOfString).toEqual(jasmine.any(Function));
  });

  it('should return an empty string if there are no tokens', () => {
    expect(endOfString([])).toEqual({
      tokens: [],
      consumed: 0,
      result: ''
    });
  });

  it('should return an error if there are tokens left', () => {
    expect(endOfString([{
      name: 'foo'
    }])).toEqual({
      tokens: [{
        name: 'foo'
      }],
      consumed: 0,
      result: new Error('Expected end of string got foo')
    });
  });
});
