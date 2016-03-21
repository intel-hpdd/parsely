
import getLexer from '../source/get-lexer';
import {describe, beforeEach, it, expect, jasmine} from './jasmine.js';

describe('The lexer', () => {
  it('should be a function', () => {
    expect(getLexer).toEqual(jasmine.any(Function));
  });

  it('should return a tokenize function', () => {
    expect(getLexer([])).toEqual(jasmine.any(Function));
  });

  describe('tokenizing', () => {
    var tokenizer;

    beforeEach(() => {
      tokenizer = getLexer([
        {
          name: 'whiteSpace',
          pattern: /^[ \t\n]+/,
          ignore: true
        },
        { name: 'join', pattern: /^and/ },
        { name: 'value', pattern: /^[a-zA-z]+/ },
        { name: 'equals', pattern: /^=/}
      ]);
    });

    it('should return a tokenizer', () => {
      expect(tokenizer).toEqual(jasmine.any(Function));
    });

    it('should return an empty array if passed a null like value', () => {
      expect(tokenizer()).toEqual([]);
    });

    it('should return an empty array for an empty string', () => {
      expect(tokenizer('')).toEqual([]);
    });

    it('should tokenize a simple expression', () => {
      expect(tokenizer('type = alert and severity = Warning'))
        .toEqual([
          { content: 'type', name: 'value', character: 0, next: jasmine.any(Object) },
          { content: '=', name: 'equals', character: 5, prev: jasmine.any(Object), next: jasmine.any(Object) },
          { content: 'alert', name: 'value', character: 7, prev: jasmine.any(Object), next: jasmine.any(Object) },
          { content: 'and', name: 'join', character: 13, prev: jasmine.any(Object), next: jasmine.any(Object) },
          { content: 'severity', name: 'value', character: 17, prev: jasmine.any(Object), next: jasmine.any(Object) },
          { content: '=', name: 'equals', character: 26, prev: jasmine.any(Object), next: jasmine.any(Object) },
          { content: 'Warning', name: 'value', character: 28, prev: jasmine.any(Object) }
        ]);
    });

    it('should tokenize errors', () => {
      expect(tokenizer('type = 23 and'))
        .toEqual([
          { content: 'type', name: 'value', character: 0, next: jasmine.any(Object) },
          { content: '=', name: 'equals', character: 5, prev: jasmine.any(Object), next: jasmine.any(Object)},
          { content: '23', name: 'error', character: 7, prev: jasmine.any(Object), next: jasmine.any(Object) },
          { content: 'and', name: 'join', character: 10, prev: jasmine.any(Object)}
        ]);
    });

    it('should handle a string ending in errors', () => {
      expect(tokenizer('type = 23'))
        .toEqual([
          { content: 'type', name: 'value', character: 0, next: jasmine.any(Object) },
          { content: '=', name: 'equals', character: 5, prev: jasmine.any(Object), next: jasmine.any(Object)},
          { content: '23', name: 'error', character: 7, prev: jasmine.any(Object) }
        ]);
    });

    it('should handle a string starting in errors', () => {
      expect(tokenizer('23 = foo'))
        .toEqual([
          { content: '23', name: 'error', character: 0, next: jasmine.any(Object) },
          { content: '=', name: 'equals', character: 3, prev: jasmine.any(Object), next: jasmine.any(Object)},
          { content: 'foo', name: 'value', character: 5, prev: jasmine.any(Object) }
        ]);
    });

    it('should handle an error string', () => {
      expect(tokenizer('23'))
        .toEqual([
          { content: '23', name: 'error', character: 0 }
        ]);
    });

    it('should handle a string with multiple errors', () => {
      expect(tokenizer('23 = 24'))
        .toEqual([
          { content: '23', name: 'error', character: 0, next: jasmine.any(Object) },
          { content: '=', name: 'equals', character: 3, prev: jasmine.any(Object), next: jasmine.any(Object)},
          { content: '24', name: 'error', character: 5, prev: jasmine.any(Object) }
        ]);
    });

    describe('linked list', () => {
      var tokens;

      beforeEach(() => {
        tokens = tokenizer('type = alert');
      });

      it('should have a previous pointer', () => {
        expect(tokens[1].prev).toEqual({
          content: 'type',
          name: 'value',
          character: 0,
          next: jasmine.any(Object)
        });
      });

      it('should have a next pointer', () => {
        expect(tokens[1].next).toEqual({
          content: 'alert',
          name: 'value',
          character: 7,
          prev: jasmine.any(Object)
        });
      });

      it('should not have a prev for the first token', () => {
        expect(tokens[0].prev).toBeUndefined();
      });

      it('should not have a next for the last token', () => {
        expect(tokens[2].next).toBeUndefined();
      });
    });
  });
});
