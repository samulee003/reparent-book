/**
 * Merge book/plan-c/*.md and build a review DOCX via OfficeCLI batch (no docx npm package).
 * Usage: node scripts/build-officecli-manuscript.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const BOOK_DIR = path.join(ROOT, 'book', 'plan-c');
const OUT_DIR = path.join(ROOT, 'book', 'output');
const OUTPUT = path.join(OUT_DIR, '責編稿_養孩子也重新好好養自己_2026-04-11.docx');

const CHAPTER_FILES = [
  'foreword.md',
  'ch01.md', 'ch02.md', 'ch03.md', 'ch04.md', 'ch05.md', 'ch06.md', 'ch07.md',
  'ch08.md', 'ch09.md', 'ch10.md', 'ch11.md', 'ch12.md',
  'afterword.md',
];

function parseMarkdown(md) {
  const lines = md.split('\n');
  const blocks = [];
  let i = 0;
  let inList = false;
  let listItems = [];
  let listType = null;
  let inBlockquote = false;
  let blockquoteLines = [];

  function flushList() {
    if (listItems.length > 0) {
      blocks.push({ type: 'list', items: [...listItems], listType });
      listItems = [];
      listType = null;
    }
    inList = false;
  }

  function flushBlockquote() {
    if (blockquoteLines.length > 0) {
      blocks.push({ type: 'blockquote', lines: [...blockquoteLines] });
      blockquoteLines = [];
    }
    inBlockquote = false;
  }

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === '') {
      flushList();
      flushBlockquote();
      i++;
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      flushList();
      flushBlockquote();
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    const h1Match = trimmed.match(/^# (.+)/);
    const h2Match = trimmed.match(/^## (.+)/);
    const h3Match = trimmed.match(/^### (.+)/);
    const h4Match = trimmed.match(/^#### (.+)/);
    if (h1Match) { flushList(); flushBlockquote(); blocks.push({ type: 'h1', text: h1Match[1] }); i++; continue; }
    if (h2Match) { flushList(); flushBlockquote(); blocks.push({ type: 'h2', text: h2Match[1] }); i++; continue; }
    if (h3Match) { flushList(); flushBlockquote(); blocks.push({ type: 'h3', text: h3Match[1] }); i++; continue; }
    if (h4Match) { flushList(); flushBlockquote(); blocks.push({ type: 'h4', text: h4Match[1] }); i++; continue; }

    if (trimmed.startsWith('> ')) {
      flushList();
      inBlockquote = true;
      blockquoteLines.push(trimmed.slice(2));
      i++;
      continue;
    }

    const ulMatch = trimmed.match(/^[-*] (.+)/);
    const olMatch = trimmed.match(/^\d+[.)] (.+)/);
    if (ulMatch || olMatch) {
      flushBlockquote();
      inList = true;
      listType = ulMatch ? 'ul' : 'ol';
      listItems.push(ulMatch ? ulMatch[1] : olMatch[1]);
      i++;
      continue;
    }

    flushList();
    flushBlockquote();

    const paraLines = [trimmed];
    i++;
    while (i < lines.length) {
      const nextLine = lines[i].trim();
      if (nextLine === '' || /^#{1,4} /.test(nextLine) || /^---+$/.test(nextLine) || /^[-*] /.test(nextLine) || /^\d+[.)] /.test(nextLine) || nextLine.startsWith('> ')) {
        break;
      }
      paraLines.push(nextLine);
      i++;
    }
    blocks.push({ type: 'paragraph', lines: paraLines });
  }

  flushList();
  flushBlockquote();

  return blocks;
}

function stripInlineMd(s) {
  return s
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1');
}

function paragraphText(lines) {
  return stripInlineMd(lines.join('\n'));
}

function blocksToOps(blocks) {
  const ops = [];
  for (const block of blocks) {
    switch (block.type) {
      case 'h1':
        ops.push({ command: 'add', parent: '/body', type: 'paragraph', props: { style: 'Heading1', text: stripInlineMd(block.text) } });
        break;
      case 'h2':
        ops.push({ command: 'add', parent: '/body', type: 'paragraph', props: { style: 'Heading2', text: stripInlineMd(block.text) } });
        break;
      case 'h3':
        ops.push({ command: 'add', parent: '/body', type: 'paragraph', props: { style: 'Heading3', text: stripInlineMd(block.text) } });
        break;
      case 'h4':
        ops.push({ command: 'add', parent: '/body', type: 'paragraph', props: { style: 'Heading4', text: stripInlineMd(block.text) } });
        break;
      case 'paragraph':
        ops.push({ command: 'add', parent: '/body', type: 'paragraph', props: { style: 'Normal', text: paragraphText(block.lines) } });
        break;
      case 'list': {
        let n = 1;
        for (const item of block.items) {
          const prefix = block.listType === 'ul' ? '• ' : `${n}. `;
          ops.push({ command: 'add', parent: '/body', type: 'paragraph', props: { style: 'List Paragraph', text: prefix + stripInlineMd(item) } });
          if (block.listType === 'ol') n += 1;
        }
        break;
      }
      case 'hr':
        ops.push({ command: 'add', parent: '/body', type: 'paragraph', props: { style: 'Normal', text: '· · · · · · · · ·' } });
        break;
      case 'blockquote':
        for (const ln of block.lines) {
          ops.push({ command: 'add', parent: '/body', type: 'paragraph', props: { style: 'Quote', text: stripInlineMd(ln) } });
        }
        break;
      default:
        break;
    }
  }
  return ops;
}

function runOfficeCli(args, stdin) {
  const r = spawnSync('officecli', args, {
    input: stdin,
    encoding: 'utf-8',
    maxBuffer: 64 * 1024 * 1024,
    shell: false,
  });
  if (r.status !== 0) {
    console.error(r.stderr || r.stdout);
    throw new Error(`officecli failed: ${args.join(' ')}`);
  }
  return r.stdout;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

fs.mkdirSync(OUT_DIR, { recursive: true });
if (fs.existsSync(OUTPUT)) fs.unlinkSync(OUTPUT);

runOfficeCli(['create', OUTPUT], null);
console.log('Created:', OUTPUT);

const titleOps = [
  { command: 'add', parent: '/body', type: 'paragraph', props: { style: 'Title', text: '養孩子，也重新好好養自己' } },
  { command: 'add', parent: '/body', type: 'paragraph', props: { style: 'Subtitle', text: '心理師的覺察式育兒練習｜責任編輯稿（plan-c）｜安頓力框架' } },
  { command: 'add', parent: '/body', type: 'paragraph', props: { style: 'Normal', text: '生成日期：2026-04-11。正文依 book/plan-c 合併；書名與「安頓力」主軸已對齊。' } },
  { command: 'add', parent: '/body', type: 'break', props: { type: 'page' } },
];

const bodyOps = [];
for (const file of CHAPTER_FILES) {
  const md = fs.readFileSync(path.join(BOOK_DIR, file), 'utf8');
  const blocks = parseMarkdown(md);
  bodyOps.push(...blocksToOps(blocks));
}

const allOps = [...titleOps, ...bodyOps];
const batches = chunk(allOps, 40);

let idx = 0;
for (const b of batches) {
  const json = JSON.stringify(b);
  runOfficeCli(['batch', OUTPUT, '--json'], json);
  idx += 1;
  process.stdout.write(`Batch ${idx}/${batches.length} (${b.length} ops)\n`);
}

runOfficeCli(['validate', OUTPUT], null);
console.log('Done. Validate OK.');
