import { Program, Element, SExpression, Atom } from './types';
//(define add3 (lambda (x) (+ x 3)))                =>  unspecified

const define = ([nameNode, exprNode]) => {
  if (nameNode.type !== 'Symbol' && exprNode.type !== 'SExpression') {
    throw new Error("Invalid parameters for 'define'");
  }

  return `const ${nameNode.value} = ${lambda(exprNode.elements.slice(1))};`;
};

const lambda = ([parameters, expr]: [SExpression, SExpression]) => {
  if (parameters.elements.some(parameter => parameter.type !== 'Symbol')) {
    throw new Error("Invalid parameters for 'lambda'");
  }

  return `(${parameters.elements.map((e: Atom) => e.value).join(', ')}) => { return ${generateNode(expr)}; }`
};

const macros: Map<string, Function> = new Map([
  ['define', define],
  ['lambda', lambda],
]);

const formatFunctionName = (name: string) => name.replace('-', '_');

const comparisonFn = (operator: string, arity = undefined) => (args: unknown[]) => {
  // Note: Need to do type checking here
  if (args.length === 1) {
    throw new Error("Not type checked yet");
  }

  if (arity && args.length !== arity) {
    throw new Error(`Incorrect number of arguments provided to ${operator} operator`);
  }

  const [head, ...rest] = args;

  return rest.map((val, index) => `${index === 0 ? head : rest[index - 1]} ${operator} ${val}`).join(' && ');
};

const operators: Map<string, Function> = new Map([
  ['=', (args: unknown[]) => {
    // Note: Need to do type checking here
    if (args.length === 1) {
      throw new Error("Not type checked yet");
    }

    const [head, ...rest] = args;

    return rest.map(val => `${head} === ${val}`).join(' && ');
  }],
  ['>', comparisonFn('>')],
  ['>=', comparisonFn('>=')],
  ['<', comparisonFn('<')],
  ['<=', comparisonFn('<=')],
  ['+', (args: unknown[]) => `(${args.join(' + ')})`],
  ['-', (args: unknown[]) => `(${args.join(' - ')})`],
  ['*', (args: unknown[]) => `(${args.join(' * ')})`],
  ['/', (args: unknown[]) => `(${args.join(' / ')})`],
  ['%', (args: unknown[]) => `(${args.join(' % ')})`],
]);

const generateFunctionCall = (node: SExpression) => {
  const [nameNode, ...args] = node.elements;
  const name = (nameNode as Atom).value.toString();
  if (operators.has(name)) {
    return operators.get(name)(args.map(generateNode));
  }

  return `fn_${formatFunctionName(name)}(${args.map(generateNode).join(', ')})`;
};

const compileSExpression = (node: SExpression) => {
  const [headNode, ...rest] = node.elements;

  if (headNode.type !== 'SExpression') {
    // Function call or list
    const symbol = headNode.value.toString();

    if (macros.has(symbol)) {
      return macros.get(symbol)(rest);
    }

    if (operators.has(symbol)) {
      return operators.get(symbol)(rest.map(generateNode));
    }
  }

  // SExpression as first element

  return generateFunctionCall(node);
};

const generateNode = (node: Element): string => {
  switch (node.type) {
    case 'SExpression': return compileSExpression(node);
    case 'Integer': return node.value.toString();
    case 'Float': return node.value.toString();
    case 'Symbol': return node.value.toString();
    case 'String': return node.value.toString();
    case 'Boolean': return node.value === 't' ? 'true' : 'false';
    default: throw new Error(`Unknown node: ${JSON.stringify(node, null, 2)}`);
  }
};

export const generate = (program: Program): string => {
  return program.body.map(generateNode).join('\n');
};
