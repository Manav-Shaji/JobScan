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
  { from: /@\/frontend\/features\/landing\/features/g, to: '@/app/(landing)/features' },
  { from: /@\/frontend\/hooks\/use-toast/g, to: '@/core/ui/use-toast' },
  { from: /@\/frontend\/features\/dashboard\/DashboardLayout/g, to: '@/features/dashboard/DashboardLayout' },
  { from: /@\/frontend\/features\/dashboard\/Overview/g, to: '@/features/dashboard/Overview' },
  { from: /@\/frontend\/features\/dashboard\/History/g, to: '@/features/dashboard/History' },
  { from: /@\/frontend\/features\/dashboard\/Settings/g, to: '@/features/dashboard/Settings' },
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
