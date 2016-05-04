import {flow, curry} from 'intel-fp';
import getLexer from '../source/get-lexer';

export default curry(2, (p, t) => {
  var tokens;
  const parser = flow(
    getLexer([
      {
        name: 'whiteSpace',
        pattern: /^[ \t\n]+/,
        ignore: true
      },
      {
        name: 'join',
        pattern: /^and/
      },
      {
        name: 'value',
        pattern: /^[a-zA-z]+/
      },
      {
        name: 'equals',
        pattern: /^=/
      }
    ]),
    x => tokens = x,
    p
  );

  const parsed = parser(t);

  return {tokens, parsed};
});
