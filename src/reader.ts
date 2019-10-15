import { createInterface } from 'readline';

export const readFromStdin = () : Promise<string> =>
  new Promise((resolve, reject) => {
    console.log("Starting to read...");
    const lines = [];

    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });

    rl.on('line', (line) => {
      //console.log(`Reading line ${line}`);
      lines.push(line)
    });

    rl.on('close', () => {
      console.log("Done!");
      resolve(lines.join('\n'));
    });

    rl.on('SIGINT', () => {
      console.error('Aborting...');
      reject(new Error('SIGINT'));
    });
  })

