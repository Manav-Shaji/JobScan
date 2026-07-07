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
  { from: /@\/backend\/ai\/gemini-provider/g, to: '@/core/ai/client' },
  { from: /@\/backend\/ai\/prompts/g, to: '@/core/ai/prompts' },
  { from: /@\/backend\/api\//g, to: '@/core/api/' },
  { from: /@\/backend\/auth/g, to: '@/core/auth' },
  { from: /@\/database\/connection\/db/g, to: '@/core/db/client' },
  { from: /@\/database\/schema\/schema\.sql/g, to: '@/core/db/schema.sql' },
  { from: /@\/frontend\/providers\//g, to: '@/core/providers/' },
  { from: /@\/frontend\/ui\/feedback\/toasts/g, to: '@/core/ui/toasts' },
  { from: /@\/frontend\/ui\/feedback\/Alert/g, to: '@/core/ui/Alert' },
  { from: /@\/frontend\/ui\/overlay\/dialog/g, to: '@/core/ui/dialog' },
  { from: /@\/frontend\/ui\/overlay\/Sheet/g, to: '@/core/ui/Sheet' },
  { from: /@\/frontend\/ui\/navigation/g, to: '@/core/ui/navigation' },
  { from: /@\/frontend\/ui\/components\/PwaUpdater/g, to: '@/core/ui/PwaUpdater' },
  { from: /@\/frontend\/ui\/forms/g, to: '@/core/ui/forms' },
  { from: /@\/frontend\/ui\/layout\/ThemeToggle/g, to: '@/core/ui/ThemeToggle' },
  { from: /@\/frontend\/ui\/layout\/ChatWidget/g, to: '@/core/ui/ChatWidget' },
  { from: /@\/frontend\/ui\/layout\/BottomNavigation/g, to: '@/core/ui/BottomNavigation' },
  { from: /@\/frontend\/ui\/layout\/AppClientWrapper/g, to: '@/core/ui/AppClientWrapper' },
  { from: /@\/frontend\/ui\/layout\/Navbar/g, to: '@/core/ui/Navbar' },
  { from: /@\/frontend\/ui\/layout/g, to: '@/core/ui/layout' },
  { from: /@\/frontend\/ui\//g, to: '@/core/ui/' },
  { from: /@\/backend\/cache/g, to: '@/core/lib/cache' },
  { from: /@\/backend\/logging\/logger/g, to: '@/core/lib/logger' },
  { from: /@\/frontend\/utils\/api-client/g, to: '@/core/api/client' },
  { from: /@\/shared\/utils/g, to: '@/core/lib/utils' }
];

walk('./src', (err, results) => {
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

walk('./extension', (err, results) => {
  if (err) throw err;
  results.filter(f => f.endsWith('.ts') || f.endsWith('.tsx') || f.endsWith('.js') || f.endsWith('.jsx')).forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    replacements.forEach(r => {
      content = content.replace(r.from, r.to);
    });
    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log(`Updated extension ${file}`);
    }
  });
});

