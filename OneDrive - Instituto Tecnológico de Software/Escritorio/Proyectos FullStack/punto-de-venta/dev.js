const { spawn } = require('child_process');
const path = require('path');

const root = __dirname;
const backend = path.join(root, 'backend');
const frontend = path.join(root, 'frontend');

const start = (name, cwd, command, args) => {
  const child = spawn(command, args, {
    cwd,
    stdio: 'inherit',
    shell: true,
  });

  child.on('exit', (code) => {
    if (code !== 0) {
      console.error(`${name} exited with code ${code}`);
    }
  });

  return child;
};

start('backend', backend, 'node', ['server.js']);
start('frontend', frontend, 'npm', ['run', 'dev', '--', '--host', '127.0.0.1']);
