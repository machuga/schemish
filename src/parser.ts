import { Token, TokenStream, Expression, Program, SExpression, Atom, AtomType, Element } from './types';
import { Operator } from './tokens';

const createStream = (tokens: Token[]): TokenStream => {
  let current = 0;
  const peek = (offset = 0) => tokens[current + offset];
  const next = () => {
    const token = peek();

    current += 1;

    return token;
  };

  const isEOF = () => peek() === undefined;

  const positionInfo = () => tokens[current].position;

  return {
    next, peek, isEOF, positionInfo
  };
};

export const parse = (tokens: Token[]): Program => {
  const { next, isEOF } = createStream(tokens);

  const parseAtom = (current: Token): Atom => {
    return {
      type: current.kind === 'Identifier' ? 'Symbol' : <AtomType>current.kind,
      value: current.value,
      position: current.position,
    };
  };

  const parseArgs = (): Element[] => {
    const args: Element[] = [];

    // Get the next value
    let current = next();

    while (!isEOF() && current.value !== Operator.CloseParen) {
      if (current.value === Operator.OpenParen) {
        args.push(parseForm(current));
      } else {
        args.push(parseAtom(current));
      }
      current = next();
    }


    return args;
  };

  const parseForm = (openParenToken: Token): SExpression => {
    // Ignore the opening paren

    const node: SExpression = {
      type: 'SExpression',
      elements: parseArgs(),
      position: openParenToken.position,
    };

    return node;
  }

  const nodes: Element[] = [];

  while (!isEOF()) {
    let token = next();

    switch (token.value) {
      case Operator.OpenParen:
        nodes.push(parseForm(token));
        break;
      default:
        console.error("This is bad", token, token.value === Operator.OpenParen);
        throw new Error('oh no');
    }
  }

  return {
    name: 'Program',
    body: nodes,
    position: {
      line: 0,
      column: 0,
    }
  };
}
