const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(file => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          if (file.includes('node_modules') || file.includes('.next') || file.includes('dist')) {
            if (!--pending) done(null, results);
            return;
          }
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

const replacements = [
  // Merge 1: API response
  { from: /@\/core\/api\/errors/g, to: '@/core/api/response' },
  { from: /@\/core\/api\/error-handler/g, to: '@/core/api/response' },
  { from: /@\/core\/api\/http-response/g, to: '@/core/api/response' },
  
  // Merge 6: scans utils
  { from: /@\/features\/scans\/utils/g, to: '@/features/scans/service' },

  // Merge 8: providers
  { from: /@\/core\/providers\/job-provider/g, to: '@/core/providers/providers' },
  { from: /@\/core\/providers\/theme-provider/g, to: '@/core/providers/providers' },
  
  // Merge 9: extension environment
  { from: /\.\/environment/g, to: './api' }
];

const updateFiles = (dir) => {
  walk(dir, (err, results) => {
    if (err) throw err;
    results.filter(f => f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx')).forEach(file => {
      let content = fs.readFileSync(file, 'utf8');
      let original = content;
      replacements.forEach(r => {
        content = content.replace(r.from, r.to);
      });
      if (content !== original) {
        fs.writeFileSync(file, content);
        console.log(`Updated ${file}`);
      }
    });
  });
}

updateFiles('./src');
updateFiles('./extension');
