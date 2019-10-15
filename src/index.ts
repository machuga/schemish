// Lexer
//
// Read from stdin

import { readFromStdin } from './reader';
import { lex } from './lexer';
import { createStream } from './input-stream';


readFromStdin().then((data) => {
  console.log('received data: ', data);
  const tokens = lex(createStream(data));
  console.log('tokens:', tokens);
})
