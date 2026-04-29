const fs = require('fs');
const path = require('path');

const dirs = ['.next', 'tsconfig.tsbuildinfo'];

dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    console.log(`Cleaning ${dir}...`);
    try {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`Successfully cleaned ${dir}`);
    } catch (err) {
      console.error(`Error cleaning ${dir}:`, err.message);
      console.log('Try closing your dev server or any program using these files.');
    }
  }
});
