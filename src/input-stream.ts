import { InputStream } from './types';
import {PositionInfo} from './types';

export const createStream = (input : string) : InputStream => {
  let currentPosition = 0;
  let currentLine = 0;
  let currentColumn = 0;

  const next = () : string => {
    const currentChar = peek();

    currentPosition += 1;

    if (currentChar === "\n") {
      currentLine += 1;
      currentColumn = 0;
    } else {
      currentColumn += 1;
    }

    return currentChar;
  };

  const peek = (offset : number = 0) : string =>
    input.charAt(currentPosition + offset);

  const isEOF = () : boolean => peek() === "";

  const positionInfo = () : PositionInfo => ({
    line: currentLine,
    column: currentColumn,
  });

  return {
    next,
    peek,
    isEOF,
    positionInfo
  };
};
