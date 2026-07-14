const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory() && !file.includes('node_modules') && !file.includes('.next')) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            results.push(file);
        }
    });
    return results;
}

const files = walk('D:/bathcrest/frontend/src');
let changed = 0;
files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    // Completely remove the process.env fallback logic
    const regex1 = /process\.env\.NEXT_PUBLIC_API_URL\s*\|\|\s*'[^']+'/g;
    const regex2 = /process\.env\.NEXT_PUBLIC_API_URL\s*\|\|\s*"[^"]+"/g;
    const replacement = "'https://measure-worship-fiber-mean.trycloudflare.com/api'";
    
    if (regex1.test(content) || regex2.test(content) || content.includes('http://localhost:5000/api') || content.includes('trycloudflare.com')) {
        content = content.replace(regex1, replacement);
        content = content.replace(regex2, replacement);
        
        // Also just in case there are naked string replacements missed
        content = content.replace(/https:\/\/[a-z0-9-]+\.trycloudflare\.com\/api/g, 'https://measure-worship-fiber-mean.trycloudflare.com/api');
        
        fs.writeFileSync(f, content, 'utf8');
        changed++;
    }
});
console.log(`Forcefully patched ${changed} files to ignore Netlify env vars.`);
