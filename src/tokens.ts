export const operators = new Map([
  ['(', 'O_PAREN'],
  [')', 'C_PAREN'],
  ['"', 'DBL_QUOTE'],
  ["'", 'SNG_QUOTE'],
]);

export enum Operator {
  O_PAREN   = '(',
  C_PAREN   = ')',
  DBL_QUOTE = '"',
  SNG_QUOTE = "'",
};
