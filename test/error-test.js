import {onError, onSuccess, default as error} from '../source/error.js';
import {describe, beforeEach, expect, it, jasmine} from './jasmine.js';
import {__} from 'intel-fp';

describe('error module', () => {
  var t, message, e;

  beforeEach(() => {
    t = {
      start: 0,
      end: 1,
      name: 'value',
      content: 'a'
    };

    e = error(t, ['foo']);

    message = e => e.message;
  });

  describe('error', () => {
    it('should be a function', () => {
      expect(error)
        .toEqual(jasmine.any(Function));
    });

    it('should take token start', () => {
      expect(e.start).toBe(0);
    });

    it('should take token end', () => {
      expect(e.end).toBe(1);
    });

    it('should take expected', () => {
      expect(e.expected).toEqual(['foo']);
    });

    it('should report more than one expectation', () => {
      expect(message(error(t, ['foo', 'bar'])))
        .toEqual('Expected one of foo, bar got a at character 0');
    });

    it('should report a single expectation', () => {
      expect(message(error(t, ['foo'])))
        .toEqual('Expected foo got a at character 0');
    });

    it('should report the end of string', () => {
      t.start = t.end = Infinity;

      expect(message(error(t, ['foo'])))
        .toEqual('Expected foo got end of string');
    });
  });

  describe('on success', () => {
    it('should be a function', () => {
      expect(onSuccess)
        .toEqual(jasmine.any(Function));
    });

    it('should be curried', () => {
      expect(onSuccess(__, __))
        .toEqual(jasmine.any(Function));
    });

    it('should change the result', () => {
      expect(
        onSuccess(
          () => 'hi!',
          {
            tokens: [],
            result: 'hello'
          }
        )
      )
        .toEqual({
          tokens: [],
          result: 'hi!'
        });
    });

    it('should keep an error result', () => {
      expect(
        onSuccess(
          () => 'hi!',
          {
            tokens: [],
            result: e
          }
        )
      )
        .toEqual({
          tokens: [],
          result: e
        });
    });
  });

  describe('on error', () => {
    it('should be a function', () => {
      expect(onError)
        .toEqual(jasmine.any(Function));
    });

    it('should be curried', () => {
      expect(onError(__, __))
        .toEqual(jasmine.any(Function));
    });

    it('should change the result', () => {
      expect(
        onError(
          e => e.adjust(['baz']),
          {
            tokens: [],
            result: e
          }
        )
      )
        .toEqual({
          tokens: [],
          result: error(t, ['baz'])
        });
    });

    it('should keep a success result', () => {
      expect(
        onError(
          e => e.adjust(['baz']),
          {
            tokens: [],
            result: 'hello'
          }
        )
      )
        .toEqual({
          tokens: [],
          result: 'hello'
        });
    });
  });
});
