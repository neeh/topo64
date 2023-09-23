import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'http-server';
import opener from 'opener';
import svelte from 'rollup-plugin-svelte';
import css from 'rollup-plugin-css-only';
import nodeResolve from '@rollup/plugin-node-resolve';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const {
  PROD = false,
  SERVE = false,
  OPEN = false
} = process.env;

const destination = path.join(__dirname, 'dist');

function clean() {
  let first = true;
  return {
    name: 'clean',
    buildStart() {
      if (!first) return;
      first = false;
      if (fs.existsSync(destination)) {
        fs.rmSync(destination, { recursive: true });
      }
    }
  };
}

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    if (srcFile === destDir) continue;

    const destFile = path.resolve(destDir, file);
    const stat = fs.statSync(srcFile);
    if (stat.isDirectory()) {
      copyDir(srcFile, destFile)
    } else {
      fs.copyFileSync(srcFile, destFile)
    }
  }
}

function copyPublicDir() {
  let first = true;
  return {
    name: 'copy-public-dir',
    writeBundle() {
      if (!first) return;
      first = false;
      console.log('Copy public dir...');
      copyDir(path.resolve(__dirname, 'public'), destination);
    }
  };
}

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
    clean(),
    svelte({
      include: 'src/components/**/*.svelte',
      compilerOptions: {
        dev: !PROD
      }
    }),
    css({
      output: 'bundle.css'
    }),
    nodeResolve({
      browser: true
    }),
    copyPublicDir(),
    SERVE && serve(),
  ],
  watch: {
    clearScreen: false
  }
};
