const fs = require('fs');
const https = require('https');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)){
    fs.mkdirSync(publicDir, { recursive: true });
}

// Generate Red background PNGs with white "TC" and "Tumkurconnect" text 
// using a placeholder API, so we don't need Photoshop or canvas package.
const urls = [
  { size: 192, name: 'icon-192x192.png', url: 'https://placehold.co/192x192/dc2626/ffffff/png?text=TC&font=Montserrat' },
  { size: 512, name: 'icon-512x512.png', url: 'https://placehold.co/512x512/dc2626/ffffff/png?text=Tumkur\\nConnect&font=Montserrat' }
];

urls.forEach(item => {
  const filePath = path.join(publicDir, item.name);
  const file = fs.createWriteStream(filePath);
  
  https.get(item.url, response => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Successfully generated ${item.name}`);
    });
  }).on('error', err => {
    fs.unlink(filePath, () => {});
    console.error(`Error generating ${item.name}:`, err.message);
  });
});
