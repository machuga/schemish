import { Operator, operators } from './tokens';
import { Token, InputStream } from './types';
import { readString, readWhile, readUntil } from './lexing';

const isWhitespace = (ch : string) => " \t\n".indexOf(ch) >= 0;
const consumeWhitespace = (input : InputStream) : string =>
  readWhile(isWhitespace, input);

const readUntilSeparator = (input : InputStream) : string =>
  readUntil((ch) => operators.has(ch) || isWhitespace(ch), input);

const isNumber = (value : string) => !isNaN(parseFloat(value)) && isFinite(<any>value);



export const lex = (input : InputStream) : Token[] => {
  const tokens : Token[] = [];

  while (!input.isEOF()) {
    consumeWhitespace(input);
    let value = input.next(); // consider using peek for a few things here

    if (operators.has(value)) {
      const operator = operators.get(value);

      switch(value) {
        case Operator.O_PAREN:
          tokens.push({
            value,
            kind: operator,
            position: input.positionInfo()
          });
          break;
        case Operator.C_PAREN:
          tokens.push({
            value,
            kind: operator,
            position: input.positionInfo()
          });
          break;
        case Operator.DBL_QUOTE:
          const str = readString(value, input);

          tokens.push({
            value: str,
            kind: 'STRING',
            position: input.positionInfo()
          });
          break;
        case Operator.SNG_QUOTE:
          throw new Error('Single quote not implemented');
        default:
          throw new Error(`Unknown Operator "${operator}". Impossible`);
      }
    } else {
      const str = value + readUntilSeparator(input);

      if (isNumber(str)) {
        const num = parseFloat(str);

        tokens.push({
          value: num,
          kind: str.includes('.') ? 'FLOAT' : 'INTEGER',
          position: input.positionInfo()
        });
      } else if (str === 'true' || str === 'false'){
        tokens.push({
          value: str,
          kind: 'BOOLEAN',
          position: input.positionInfo()
        });
      } else {
        if (str.includes('.')) {
          throw new Error('is dot reserved?');
        }

        // numbers and identifiers
        tokens.push({ value: str, kind: 'IDENT', position: input.positionInfo() });
      }
    }
  }

  return tokens;
}
