import {Expression} from './types';

const formatFunctionName = (name : string) => name.replace('-', '_');
const generateFunctionCall = (node : any) => {
  return `fn_${formatFunctionName(node.name)}(${node.args.map(arg => arg.value).join(', ')})`;
};

export const generate = (ast : Expression) : string => {
  return `function () { return ${generateFunctionCall(ast)}; };`;
};
