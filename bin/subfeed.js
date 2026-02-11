#!/usr/bin/env node
const command = process.argv[2];

if (command === 'init') {
  require('../src/cli/init')();
} else {
  console.log('Usage: npx subfeed init');
  console.log('  Generates AGENTS.md for your project with Subfeed integration patterns.');
}
