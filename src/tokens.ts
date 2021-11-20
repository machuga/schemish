export enum Operator {
  OpenParen = '(',
  CloseParen = ')',
  DoubleQuote = '"',
  SingleQuote = "'",
};

export enum OperatorName {
  OpenParen = 'OpenParen',
  CloseParen = 'CloseParen',
  DoubleQuote = 'DoubleQuote',
  SingleQuote = "SingleQuote",
};

export const operators: Map<Operator, string> = new Map([
  [Operator.OpenParen, OperatorName.OpenParen],
  [Operator.CloseParen, OperatorName.CloseParen],
  [Operator.DoubleQuote, OperatorName.DoubleQuote],
  [Operator.SingleQuote, OperatorName.SingleQuote],
]);

