import { Operator, operators } from './tokens';
import { Token, InputStream } from './types';
import { readString, readWhile, readUntil } from './lexing';

const whitespaceChars = new Set([" ", "\t", "\n"]);

const isWhitespace = (ch: string) => whitespaceChars.has(ch);

const consumeWhitespace = (input: InputStream): string => readWhile(isWhitespace, input);

const readUntilSeparator = (input: InputStream): string =>
  readUntil((ch) => operators.has(<Operator>ch) || isWhitespace(ch), input);

const isNumber = (value: string) => !isNaN(parseFloat(value)) && isFinite(<any>value);



export const lex = (input: InputStream): Token[] => {
  const tokens: Token[] = [];

  while (!input.isEOF()) {
    consumeWhitespace(input);

    let value = input.next(); // consider using peek for a few things here

    if (operators.has(<Operator>value)) {
      const operator = operators.get(<Operator>value);

      switch (value) {
        case Operator.OpenParen:
          tokens.push({
            value,
            kind: operator,
            position: input.positionInfo()
          });
          break;
        case Operator.CloseParen:
          tokens.push({
            value,
            kind: operator,
            position: input.positionInfo()
          });
          break;
        case Operator.DoubleQuote:
          tokens.push({
            value: readString(value, input),
            kind: 'String',
            position: input.positionInfo()
          });
          break;
        case Operator.SingleQuote:
          tokens.push({
            value,
            kind: 'SingleQuote',
            position: input.positionInfo()
          });
          break;
        default:
          throw new Error(`Unknown Operator "${operator}". Impossible`);
      }
    } else {
      const str = value + readUntilSeparator(input);

      if (isNumber(str)) {
        const num = parseFloat(str);

        tokens.push({
          value: num,
          kind: str.includes('.') ? 'Float' : 'Integer',
          position: input.positionInfo()
        });
      } else if (str === 'true' || str === 'false') {
        tokens.push({
          value: str,
          kind: 'Boolean',
          position: input.positionInfo()
        });
      } else {
        if (str.includes('.')) {
          throw new Error(`is dot reserved?, "${str}"`);
        }

        // numbers and identifiers
        tokens.push({ value: str, kind: 'Identifier', position: input.positionInfo() });
      }
    }
  }

  return tokens;
}
