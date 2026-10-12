import fs from 'node:fs';
import path from 'node:path';

// Check if Soni-Frontend-Interview-Doc-main exists, otherwise use root
let SRC_DIR = path.resolve('.');
if (fs.existsSync(path.resolve('Soni-Frontend-Interview-Doc-main'))) {
  SRC_DIR = path.resolve('Soni-Frontend-Interview-Doc-main');
}

const DOCS_DIR = path.resolve('src/content/docs');
const PUBLIC_APPS_DIR = path.resolve('public/apps');

function ensureDirSync(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

if (fs.existsSync(DOCS_DIR)) {
  fs.rmSync(DOCS_DIR, { recursive: true, force: true });
}
ensureDirSync(DOCS_DIR);

if (fs.existsSync(PUBLIC_APPS_DIR)) {
  fs.rmSync(PUBLIC_APPS_DIR, { recursive: true, force: true });
}
ensureDirSync(PUBLIC_APPS_DIR);

const indexPageContent = `---
title: Wenodh Frontend Interview Handbook
description: Comprehensive, structured frontend interview prep including DSA, JS Polyfills, Machine Coding Apps, Snippets, and Real Company Interview Experiences.
template: splash
hero:
  tagline: Master Frontend Engineering Interviews with Interactive Demos, JS Polyfills, DSA Notes, and Company Insights.
  actions:
    - text: Explore DSA Cheatsheet
      link: /dsa/dsa/
      icon: right-arrow
      variant: primary
    - text: Practice Machine Coding
      link: /machine-coding/google-calender/
      icon: external
---

import { Card, CardGrid } from '@astrojs/starlight/components';

## 🚀 What's Inside

<CardGrid stagger>
	<Card title="🧠 DSA Cheatsheet" icon="pencil">
		Core data structures and algorithms concepts tailored for frontend engineers.
	</Card>
	<Card title="⚡ JS Polyfills & Utilities" icon="setting">
		Handwritten polyfills for \`Promise.all\`, \`debounce\`, \`throttle\`, \`bind\`, \`deepClone\`, and more.
	</Card>
	<Card title="💻 Interactive Machine Coding" icon="laptop">
		Live runnable mini-applications like WhatsApp Chat, Google Calendar, Nested Checkbox, TypeAhead, File Tree with embedded previews.
	</Card>
	<Card title="🏢 Company Experiences" icon="open-book">
		Real interview questions and round experiences from Google, Amazon, Uber, Rippling, Dream11, Thoughtspot, and more.
	</Card>
</CardGrid>
`;

fs.writeFileSync(path.join(DOCS_DIR, 'index.mdx'), indexPageContent, 'utf-8');

function formatTitle(str) {
  if (str.toLowerCase() === 'dsa') return 'DSA Cheatsheet';
  if (str.toLowerCase() === 'cp-code-template') return 'CP Code Templates';
  let isUpcoming = false;
  if (/\[upcoming\]/i.test(str)) {
    isUpcoming = true;
    str = str.replace(/\[upcoming\]/gi, '');
  }
  let cleanStr = str.replace(/[-_]/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2');
  cleanStr = cleanStr.charAt(0).toUpperCase() + cleanStr.slice(1);
  return isUpcoming ? `${cleanStr} (Upcoming)` : cleanStr;
}

// 2. Sync DSA Cheatsheet
const dsaSourceDir = path.join(SRC_DIR, 'DSA_cheetsheet');
const dsaTargetDir = path.join(DOCS_DIR, 'dsa');
ensureDirSync(dsaTargetDir);
if (fs.existsSync(dsaSourceDir)) {
  const files = fs.readdirSync(dsaSourceDir);
  for (const file of files) {
    if (file.endsWith('.md')) {
      let content = fs.readFileSync(path.join(dsaSourceDir, file), 'utf-8');
      const nameWithoutExt = path.basename(file, '.md');
      const title = formatTitle(nameWithoutExt);
      const order = nameWithoutExt.toLowerCase() === 'dsa' ? 1 : 2;

      if (!content.trim().startsWith('---')) {
        content = `---\ntitle: "${title}"\ndescription: "DSA Cheatsheet and concepts for frontend interviews."\nsidebar:\n  order: ${order}\n---\n\n` + content;
      } else {
        // If frontmatter already exists, ensure sidebar order is present or updated
        if (!content.includes('sidebar:')) {
          content = content.replace(/^---/m, `---\nsidebar:\n  order: ${order}`);
        }
      }
      fs.writeFileSync(path.join(dsaTargetDir, file), content, 'utf-8');
    }
  }
}

// 3. Sync Code Snippets
const snippetSourceDir = path.join(SRC_DIR, 'code_snippet');
const snippetTargetDir = path.join(DOCS_DIR, 'code-snippets');
ensureDirSync(snippetTargetDir);
if (fs.existsSync(snippetSourceDir)) {
  const files = fs.readdirSync(snippetSourceDir);
  for (const file of files) {
    if (file.endsWith('.md')) {
      let content = fs.readFileSync(path.join(snippetSourceDir, file), 'utf-8');
      const nameWithoutExt = path.basename(file, '.md');
      const title = formatTitle(nameWithoutExt);
      if (!content.trim().startsWith('---')) {
        content = `---\ntitle: "${title}"\ndescription: "JavaScript conceptual code snippets and output questions."\n---\n\n` + content;
      }
      fs.writeFileSync(path.join(snippetTargetDir, file), content, 'utf-8');
    }
  }
}

// 4. Sync Interview Experiences
const expSourceDir = path.join(SRC_DIR, 'interview_experience');
const expTargetDir = path.join(DOCS_DIR, 'interview-experiences');
ensureDirSync(expTargetDir);
if (fs.existsSync(expSourceDir)) {
  const items = fs.readdirSync(expSourceDir);
  for (const item of items) {
    const itemPath = path.join(expSourceDir, item);
    const stat = fs.statSync(itemPath);
    if (stat.isFile() && item.endsWith('.md')) {
      let content = fs.readFileSync(itemPath, 'utf-8');
      const nameWithoutExt = path.basename(item, '.md');
      const title = formatTitle(nameWithoutExt);
      if (!content.trim().startsWith('---')) {
        content = `---\ntitle: "${title}"\ndescription: "Frontend interview experience at ${title}."\n---\n\n` + content;
      }
      fs.writeFileSync(path.join(expTargetDir, item), content, 'utf-8');
    } else if (stat.isDirectory()) {
      const subTargetDir = path.join(expTargetDir, item.toLowerCase());
      ensureDirSync(subTargetDir);
      const subFiles = fs.readdirSync(itemPath);
      for (const subFile of subFiles) {
        if (subFile.endsWith('.md')) {
          let content = fs.readFileSync(path.join(itemPath, subFile), 'utf-8');
          const nameWithoutExt = path.basename(subFile, '.md');
          const title = `${formatTitle(item)} - ${formatTitle(nameWithoutExt)}`;
          if (!content.trim().startsWith('---')) {
            content = `---\ntitle: "${title}"\ndescription: "Interview questions and rounds for ${title}."\n---\n\n` + content;
          }
          fs.writeFileSync(path.join(subTargetDir, subFile), content, 'utf-8');
        }
      }
    }
  }
}

// 5. Sync JS Coding Questions & Polyfills
const jsCodingSourceDir = path.join(SRC_DIR, 'JS_Coding_Questions');
const jsCodingTargetDir = path.join(DOCS_DIR, 'js-coding');
ensureDirSync(jsCodingTargetDir);

if (fs.existsSync(jsCodingSourceDir)) {
  const items = fs.readdirSync(jsCodingSourceDir);

  for (const item of items) {
    const itemPath = path.join(jsCodingSourceDir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isFile()) {
      if (item.endsWith('.js')) {
        const nameWithoutExt = path.basename(item, '.js');
        const title = formatTitle(nameWithoutExt);
        const code = fs.readFileSync(itemPath, 'utf-8');
        const mdContent = `---\ntitle: "${title}"\ndescription: "Implementation and code solution for ${title}."\n---\n\n\`\`\`javascript\n${code}\n\`\`\`\n`;
        fs.writeFileSync(path.join(jsCodingTargetDir, `${nameWithoutExt}.md`), mdContent, 'utf-8');
      } else if (item.endsWith('.md') && item !== 'README.md') {
        let content = fs.readFileSync(itemPath, 'utf-8');
        const nameWithoutExt = path.basename(item, '.md');
        const title = formatTitle(nameWithoutExt);
        if (!content.trim().startsWith('---')) {
          content = `---\ntitle: "${title}"\ndescription: "JS Coding Question details."\n---\n\n` + content;
        }
        fs.writeFileSync(path.join(jsCodingTargetDir, item), content, 'utf-8');
      }
    } else if (stat.isDirectory()) {
      const subTargetDir = path.join(jsCodingTargetDir, item.toLowerCase());
      ensureDirSync(subTargetDir);

      const publicAppDir = path.join(PUBLIC_APPS_DIR, 'js-coding', item.toLowerCase());
      ensureDirSync(publicAppDir);

      const subFiles = fs.readdirSync(itemPath);
      let htmlFile = null, jsFile = null, cssFile = null, mdFile = null;

      for (const subFile of subFiles) {
        const subFilePath = path.join(itemPath, subFile);
        fs.copyFileSync(subFilePath, path.join(publicAppDir, subFile));

        if (subFile === 'index.html') htmlFile = fs.readFileSync(subFilePath, 'utf-8');
        if (subFile.endsWith('.js')) jsFile = fs.readFileSync(subFilePath, 'utf-8');
        if (subFile.endsWith('.css')) cssFile = fs.readFileSync(subFilePath, 'utf-8');
        if (subFile.endsWith('.md')) mdFile = fs.readFileSync(subFilePath, 'utf-8');
      }

      const title = formatTitle(item);
      const appUrl = `/apps/js-coding/${item.toLowerCase()}/index.html`;

      let mdDoc = `---\ntitle: "${title}"\ndescription: "Interactive JS coding challenge: ${title}."\n---\n\nimport MachineSandbox from '../../../components/MachineSandbox.astro';\n\n`;

      if (mdFile) {
        mdDoc += `${mdFile.replace(/---[\s\S]*?---/, '')}\n\n`;
      }

      mdDoc += `<MachineSandbox appUrl="${appUrl}" htmlCode={${JSON.stringify(htmlFile || '')}} jsCode={${JSON.stringify(jsFile || '')}} cssCode={${JSON.stringify(cssFile || '')}} />\n`;

      fs.writeFileSync(path.join(jsCodingTargetDir, `${item.toLowerCase()}.mdx`), mdDoc, 'utf-8');
    }
  }
}

// 6. Sync Machine Coding Applications
const machineSourceDir = path.join(SRC_DIR, 'JS_Machine_Question');
const machineTargetDir = path.join(DOCS_DIR, 'machine-coding');
ensureDirSync(machineTargetDir);

if (fs.existsSync(machineSourceDir)) {
  const projects = fs.readdirSync(machineSourceDir);

  for (const proj of projects) {
    const projPath = path.join(machineSourceDir, proj);
    if (fs.statSync(projPath).isDirectory()) {
      const publicAppDir = path.join(PUBLIC_APPS_DIR, 'machine-coding', proj.toLowerCase());
      ensureDirSync(publicAppDir);

      const files = fs.readdirSync(projPath);
      let htmlCode = '', jsCode = '', cssCode = '';

      for (const file of files) {
        const fileSrcPath = path.join(projPath, file);
        fs.copyFileSync(fileSrcPath, path.join(publicAppDir, file));

        if (file === 'index.html') htmlCode = fs.readFileSync(fileSrcPath, 'utf-8');
        else if (file.endsWith('.js')) jsCode = fs.readFileSync(fileSrcPath, 'utf-8');
        else if (file.endsWith('.css')) cssCode = fs.readFileSync(fileSrcPath, 'utf-8');
      }

      const title = formatTitle(proj);
      const appUrl = `/apps/machine-coding/${proj.toLowerCase()}/index.html`;

      const mdDoc = `---\ntitle: "${title}"\ndescription: "Interactive machine coding implementation of ${title}."\n---\n\nimport MachineSandbox from '../../../components/MachineSandbox.astro';\n\nInteractive live demo and source code tabs for **${title}**:\n\n<MachineSandbox appUrl="${appUrl}" htmlCode={${JSON.stringify(htmlCode)}} jsCode={${JSON.stringify(jsCode)}} cssCode={${JSON.stringify(cssCode)}} />\n`;

      fs.writeFileSync(path.join(machineTargetDir, `${proj.toLowerCase()}.mdx`), mdDoc, 'utf-8');
    }
  }
}

console.log('✅ Documentation content and public interactive apps successfully synced!');
