const fs = require('fs');
const path = require('path');
const { image_search } = require('duckduckgo-images-api');
const seedStr = fs.readFileSync(path.join(__dirname, 'seed.js'), 'utf-8');

// Extremely simple extraction: look for `name: '...',`
const nameRegex = /name:\s*'([^']+)'/g;
let match;
const products = [];
while ((match = nameRegex.exec(seedStr)) !== null) {
  products.push(match[1]);
}

console.log(`Found ${products.length} products. Fetching images...`);

async function fetchImages() {
  const imagesMap = {};
  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    console.log(`[${i+1}/${products.length}] Fetching for: ${product}`);
    try {
      const results = await image_search({ query: product + ' bathroom luxury', moderate: true, iterations: 1 });
      if (results && results.length > 0) {
        imagesMap[product] = results[0].image;
        console.log(`  -> Found: ${results[0].image}`);
      } else {
        console.log(`  -> No results`);
      }
    } catch (e) {
      console.log(`  -> Error: ${e.message}`);
    }
    // small delay to prevent rate limit
    await new Promise(r => setTimeout(r, 500));
  }
  
  fs.writeFileSync(path.join(__dirname, 'productImages.json'), JSON.stringify(imagesMap, null, 2));
  console.log('Done! Saved to productImages.json');
}

fetchImages();
