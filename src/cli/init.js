const fs = require('fs');
const path = require('path');

module.exports = function init() {
  const templatePath = path.join(__dirname, '../../templates/AGENTS.md');
  const destPath = path.join(process.cwd(), 'AGENTS.md');

  if (fs.existsSync(destPath)) {
    console.log('AGENTS.md already exists. Skipping.');
    return;
  }

  const template = fs.readFileSync(templatePath, 'utf-8');
  fs.writeFileSync(destPath, template);
  console.log('Created AGENTS.md with Subfeed integration patterns.');
  console.log('  Your coding agent now knows how to use Subfeed.');
  console.log('');
  console.log('  Docs: https://subfeed.app/skill.md');
};
