import {describe, it, expect, jasmine} from './jasmine.js';
import {__} from 'intel-fp';
import match from '../source/match.js';


describe('match', () => {
  it('should be curried', () => {
    expect(match(__, __, __)).toEqual(jasmine.any(Function));
  });

  it('should return an error if there are no tokens', () => {
    expect(match('severity', x => x, [])).toEqual({
      tokens: [],
      suggest: ['severity'],
      consumed: 0,
      result: new Error('Expected severity got end of string')
    });
  });

  it('should return the result on a match', () => {
    expect(match('severity', x => x.toUpperCase(), [
      {
        name: 'value',
        content: 'severity'
      }
    ]))
    .toEqual({
      tokens: [],
      suggest: [],
      consumed: 1,
      result: 'SEVERITY'
    });
  });

  it('should return an error is there is no match', () => {
    expect(match('severity', x => x.toUpperCase(), [
      {
        name: 'value',
        content: 'type',
        start: 0
      }
    ]))
    .toEqual({
      tokens: [
        {
          name: 'value',
          content: 'type',
          start: 0
        }
      ],
      suggest: ['severity'],
      consumed: 0,
      result: new Error('Expected severity got type at character 0')
    });
  });
});
