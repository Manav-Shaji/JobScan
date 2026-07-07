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
  { from: /@\/backend\/repositories\/report-repository/g, to: '@/features/reports/reports.repository' },
  { from: /@\/backend\/services\/report-service/g, to: '@/features/reports/reports.service' },
  { from: /@\/shared\/validators\/report/g, to: '@/features/reports/validation' },
  
  { from: /@\/backend\/repositories\/chat-repository/g, to: '@/features/chat/chat.repository' },
  { from: /@\/backend\/services\/chat-service/g, to: '@/features/chat/chat.service' },
  { from: /@\/shared\/validators\/chat/g, to: '@/features/chat/validation' },
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
