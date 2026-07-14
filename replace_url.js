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
    if (content.includes('https://maintaining-nearby-students-trusts.trycloudflare.com/api')) {
        content = content.replace(/https:\/\/maintaining-nearby-students-trusts.trycloudflare.com\/api/g, 'https://measure-worship-fiber-mean.trycloudflare.com/api');
        fs.writeFileSync(f, content, 'utf8');
        changed++;
    }
});
console.log(`Changed ${changed} files.`);
