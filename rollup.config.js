import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'http-server';
import opener from 'opener';
import nodeResolve from '@rollup/plugin-node-resolve';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {
  PROD = false,
  OPEN = false
} = process.env;

const destination = path.join(__dirname, 'public');

function serve() {
  const port = 8083;
  const options = {
    root: destination,
    // gzip: true,
    // https: {
    //   cert: 'cert.pem',
    //   key: 'key.pem'
    // },
  };
  return {
    name: 'serve',
    writeBundle() {
      if (global.server) return;
      console.log('Start server...');
      const server = createServer(options);
      server.listen(port, '0.0.0.0', function () {
        const protocol = options.https ? 'https://' : 'http://';
        const url = protocol + '127.0.0.1:' + port;
        console.log('Server running at ' + url);
        if (OPEN) opener(url);
      });
      global.server = server;
    }
  };
}

export default {
  input: 'src/index.js',
  output: {
    format: 'iife',
    file: path.join(destination, 'bundle.js'),
    sourcemap: !PROD
  },
  plugins: [
    nodeResolve({
      browser: true
    }),
    serve(), // writeBundle
  ],
  watch: {
    clearScreen: false
  }
};
