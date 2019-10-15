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
  name: string
}
