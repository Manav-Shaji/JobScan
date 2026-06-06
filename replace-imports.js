const fs = require('fs');
const path = require('path');

const mapping = {
  input: 'forms',
  textarea: 'forms',
  switch: 'forms',
  select: 'forms',
  form: 'forms',
  label: 'forms',
  
  card: 'layout',
  skeleton: 'layout',
  accordion: 'layout',
  separator: 'layout',
  table: 'layout',
  
  alert: 'feedback',
  badge: 'feedback',
  progress: 'feedback',
  tooltip: 'feedback',
  'hover-card': 'feedback',
  
  tabs: 'navigation',
  pagination: 'navigation',
  'navigation-menu': 'navigation',
  
  'dropdown-menu': 'overlay',
  sheet: 'overlay',
  
  button: 'elements'
};

function getAllFiles(dir, filesList = []) {
  if (!fs.existsSync(dir)) return filesList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, filesList);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      filesList.push(fullPath);
    }
  }
  return filesList;
}

const allFiles = [...getAllFiles('src/app'), ...getAllFiles('src/frontend'), ...getAllFiles('src/components')];

let count = 0;
for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;
  
  const fileName = path.basename(file, '.tsx');
  const fileCategory = Object.values(mapping).includes(fileName) && file.includes('components/ui') ? fileName : null;

  for (const [oldName, newName] of Object.entries(mapping)) {
    const regex = new RegExp(`import\\s+.*?from\\s+['"]@\\/components\\/ui\\/${oldName}['"];?`, 'g');
    
    if (regex.test(content)) {
      if (fileCategory === newName) {
        // Intra-group import: Remove it to avoid duplicate declaration
        content = content.replace(regex, '');
      } else {
        // Change the import to point to the new category
        const replaceRegex = new RegExp(`(['"])@\\/components\\/ui\\/${oldName}\\1`, 'g');
        content = content.replace(replaceRegex, `$1@/components/ui/${newName}$1`);
      }
      changed = true;
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
    count++;
    console.log(`Updated ${file}`);
  }
}
console.log(`Updated ${count} files.`);
