export type PositionInfo = {
  line: number,
  column: number
};

export type InputStream = {
  next(): string,
  peek(): string,
  isEOF(): boolean,
  positionInfo(): PositionInfo
};

export type TokenStream = {
  next(): Token,
  peek(): Token,
  isEOF(): boolean,
  positionInfo(): PositionInfo
};

export type Token = {
  kind: string,
  value: string | number,
  position: PositionInfo
};

export type Expression = {
  name?: string,
  kind: string,
  value: string | number,
  position: PositionInfo,
  args?: Expression[]
};

export type SExpression = {
  type: 'SExpression',
  elements: Element[];
  position: PositionInfo,
};

export type Program = {
  name: 'Program',
  body: Element[],
  position: PositionInfo,
};

export type Element = Atom | SExpression;

export type AtomType = 'Integer' | 'Float' | 'String' | 'Boolean' | 'Symbol';

export type Atom = {
  type: AtomType,
  value: string | number | boolean;
  position: PositionInfo,
}
