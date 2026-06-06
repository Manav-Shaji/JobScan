const fs = require('fs');
const path = require('path');

const UI_DIR = path.join(__dirname, 'src/components/ui');

const groups = {
  forms: ['input.tsx', 'textarea.tsx', 'switch.tsx', 'select.tsx', 'form.tsx', 'label.tsx'],
  layout: ['card.tsx', 'skeleton.tsx', 'accordion.tsx', 'separator.tsx', 'table.tsx'],
  feedback: ['alert.tsx', 'badge.tsx', 'progress.tsx', 'tooltip.tsx', 'hover-card.tsx'],
  navigation: ['tabs.tsx', 'pagination.tsx', 'navigation-menu.tsx'],
  overlay: ['dropdown-menu.tsx', 'sheet.tsx'],
};

function extractImportsAndBody(content) {
  const importRegex = /^import\s+[\s\S]*?from\s+['"][^'"]+['"];?/gm;
  
  const imports = [];
  let match;
  while ((match = importRegex.exec(content)) !== null) {
    imports.push(match[0].trim());
  }
  
  // Remove use client directives and imports
  let body = content.replace(importRegex, '').replace(/['"]use client['"];?/g, '').trim();
  return { imports, body };
}

function processGroup(groupName, files) {
  let allImports = [];
  let allBodies = [];
  
  for (const file of files) {
    const filePath = path.join(UI_DIR, file);
    if (!fs.existsSync(filePath)) {
      console.warn(`File ${file} not found!`);
      continue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const { imports, body } = extractImportsAndBody(content);
    allImports.push(...imports);
    allBodies.push(body);
  }
  
  // Basic deduplication
  const uniqueImports = Array.from(new Set(allImports));
  
  const finalContent = '"use client";\n\n' + uniqueImports.join('\n') + '\n\n' + allBodies.join('\n\n');
  fs.writeFileSync(path.join(UI_DIR, `${groupName}.tsx`), finalContent);
  console.log(`Created ${groupName}.tsx`);
  
  // Delete old files
  for (const file of files) {
    const filePath = path.join(UI_DIR, file);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

for (const [groupName, files] of Object.entries(groups)) {
  processGroup(groupName, files);
}
