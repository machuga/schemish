import { Program, Expression } from './types';

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

const generateFunctionCall = (node: any) => {
  if (operators.has(node.name)) {
    return operators.get(node.name)(node.args.map(generateNode));
  }

  return `fn_${formatFunctionName(node.name)}(${node.args.map(generateNode).join(', ')})`;
};

const generateNode = (node: Expression): string => {
  switch (node.kind) {
    case 'Call': return generateFunctionCall(node);
    case 'Integer': return node.value.toString();
    case 'Float': return node.value.toString();
    case 'Identifier': return node.value.toString();
    case 'String': return node.value.toString();
    case 'Boolean': return node.value === 't' ? 'true' : 'false';
    default: throw new Error(`Unknown node: ${JSON.stringify(node, null, 2)}`);
  }
};

export const generate = (program: Program): string => {
  return program.body.map(generateNode).join('\n');
};
