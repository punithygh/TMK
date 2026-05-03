const fs = require('fs');
try {
  fs.rmSync('.next', { recursive: true, force: true });
  console.log('Successfully deleted .next directory. Cache cleared!');
} catch (e) {
  console.error('Failed to delete .next: ', e.message);
}
