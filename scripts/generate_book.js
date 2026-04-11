/**
 * Generate complete book manuscript DOCX
 * Book: 養孩子，也重新好好養自己
 * Author: 鋅鋰師拔麻（心理師）
 */
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  PageBreak, AlignmentType, TabStopPosition, TabStopType,
  TableOfContents, StyleLevel, LevelFormat,
  Header, Footer, PageNumber, NumberFormat,
  BorderStyle, ShadingType, convertInchesToTwip,
  Table, TableRow, TableCell, WidthType, VerticalAlign,
} = require('docx');

const BOOK_DIR = path.join(__dirname, '..', 'book', 'plan-c');
const OUTPUT = path.join(__dirname, '..', '養孩子也重新好好養自己_完整書稿.docx');

// ---- Config ----
const BOOK_TITLE = '養孩子，也重新好好養自己';
const BOOK_SUBTITLE = '心理師的覺察式育兒練習';
const AUTHOR = '鋅鋰師拔麻';

// Chapter files in order (plan-c structure)
const CHAPTERS = [
  { file: 'foreword.md', type: 'foreword' },
  { file: 'ch01.md', type: 'chapter', part: 1 },
  { file: 'ch02.md', type: 'chapter', part: 1 },
  { file: 'ch03.md', type: 'chapter', part: 1 },
  { file: 'ch04.md', type: 'chapter', part: 2 },
  { file: 'ch05.md', type: 'chapter', part: 2 },
  { file: 'ch06.md', type: 'chapter', part: 2 },
  { file: 'ch07.md', type: 'chapter', part: 3 },
  { file: 'ch08.md', type: 'chapter', part: 3 },
  { file: 'ch09.md', type: 'chapter', part: 3 },
  { file: 'ch10.md', type: 'chapter', part: 4 },
  { file: 'ch11.md', type: 'chapter', part: 4 },
  { file: 'ch12.md', type: 'chapter', part: 4 },
  { file: 'afterword.md', type: 'afterword' },
];

// Part titles mapping (plan-c structure)
const PART_TITLES = {
  1: { title: '第一篇　覺察', subtitle: '為什麼我會對孩子失控？' },
  2: { title: '第二篇　修復', subtitle: '抱抱那個曾經「太乖」的自己' },
  3: { title: '第三篇　實踐', subtitle: '不必急著教，先學會陪伴' },
  4: { title: '第四篇　傳承', subtitle: '給孩子一份不帶傷痕的愛' },
};

// ---- Markdown Parser ----
function parseMarkdown(md) {
  const lines = md.split('\n');
  const blocks = [];
  let i = 0;
  let inList = false;
  let listItems = [];
  let listType = null; // 'ul' or 'ol'
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

    // Empty line
    if (trimmed === '') {
      flushList();
      flushBlockquote();
      i++;
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(trimmed)) {
      flushList();
      flushBlockquote();
      blocks.push({ type: 'hr' });
      i++;
      continue;
    }

    // Heading
    const h1Match = trimmed.match(/^# (.+)/);
    const h2Match = trimmed.match(/^## (.+)/);
    const h3Match = trimmed.match(/^### (.+)/);
    const h4Match = trimmed.match(/^#### (.+)/);
    if (h1Match) { flushList(); flushBlockquote(); blocks.push({ type: 'h1', text: h1Match[1] }); i++; continue; }
    if (h2Match) { flushList(); flushBlockquote(); blocks.push({ type: 'h2', text: h2Match[1] }); i++; continue; }
    if (h3Match) { flushList(); flushBlockquote(); blocks.push({ type: 'h3', text: h3Match[1] }); i++; continue; }
    if (h4Match) { flushList(); flushBlockquote(); blocks.push({ type: 'h4', text: h4Match[1] }); i++; continue; }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList();
      inBlockquote = true;
      blockquoteLines.push(trimmed.slice(2));
      i++;
      continue;
    }

    // List items
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

    // Regular paragraph - flush list and blockquote first
    flushList();
    flushBlockquote();

    // Paragraph: collect consecutive non-empty, non-special lines
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

// Parse inline formatting: **bold**, *italic*, `code`
function parseInlineRuns(text, options = {}) {
  const runs = [];
  const { bold: defaultBold = false, italic: defaultItalic = false, color } = options;

  // Simple regex-based inline parser
  const regex = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Text before match
    if (match.index > lastIndex) {
      const before = text.slice(lastIndex, match.index);
      if (before) {
        runs.push(new TextRun({
          text: before,
          bold: defaultBold,
          italics: defaultItalic,
          size: defaultBold ? 28 : 24, // 14pt for bold, 12pt for normal
          font: 'Microsoft JhengHei',
          ...(color ? { color } : {}),
        }));
      }
    }

    if (match[2]) {
      // ***bold italic***
      runs.push(new TextRun({ text: match[2], bold: true, italics: true, size: 24, font: 'Microsoft JhengHei', ...(color ? { color } : {}) }));
    } else if (match[3]) {
      // **bold**
      runs.push(new TextRun({ text: match[3], bold: true, size: 24, font: 'Microsoft JhengHei', ...(color ? { color } : {}) }));
    } else if (match[4]) {
      // *italic*
      runs.push(new TextRun({ text: match[4], italics: true, size: 24, font: 'Microsoft JhengHei', ...(color ? { color } : {}) }));
    } else if (match[5]) {
      // `code`
      runs.push(new TextRun({ text: match[5], font: 'Consolas', size: 22, shading: { type: ShadingType.SOLID, color: 'F0F0F0' }, ...(color ? { color } : {}) }));
    }

    lastIndex = regex.lastIndex;
  }

  // Remaining text
  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex);
    if (remaining) {
      runs.push(new TextRun({
        text: remaining,
        bold: defaultBold,
        italics: defaultItalic,
        size: defaultBold ? 28 : 24,
        font: 'Microsoft JhengHei',
        ...(color ? { color } : {}),
      }));
    }
  }

  return runs.length > 0 ? runs : [new TextRun({ text, bold: defaultBold, italics: defaultItalic, size: defaultBold ? 28 : 24, font: 'Microsoft JhengHei' })];
}

// ---- Block to Paragraph converter ----
function blocksToParagraphs(blocks) {
  const paragraphs = [];

  for (const block of blocks) {
    switch (block.type) {
      case 'h1':
        paragraphs.push(new Paragraph({
          text: block.text,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 600, after: 300 },
          thematicBreak: true,
        }));
        break;

      case 'h2':
        paragraphs.push(new Paragraph({
          text: block.text,
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        }));
        break;

      case 'h3':
        paragraphs.push(new Paragraph({
          text: block.text,
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 300, after: 150 },
        }));
        break;

      case 'h4':
        paragraphs.push(new Paragraph({
          text: block.text,
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 200, after: 100 },
        }));
        break;

      case 'paragraph':
        // Join lines and create paragraph with inline formatting
        const fullText = block.lines.join(' ').replace(/\*\*/g, '**');
        // Check if the text is fully bold (starts with ** and ends with **)
        const isFullyBold = /^\*\*(.+)\*\*$/.test(fullText.trim());
        if (isFullyBold) {
          const boldText = fullText.trim().replace(/^\*\*/, '').replace(/\*\*$/, '');
          paragraphs.push(new Paragraph({
            children: [new TextRun({ text: boldText, bold: true, size: 24, font: 'Microsoft JhengHei' })],
            spacing: { before: 120, after: 120 },
          }));
        } else {
          paragraphs.push(new Paragraph({
            children: parseInlineRuns(fullText),
            spacing: { before: 120, after: 120, line: 400 },
          }));
        }
        break;

      case 'list':
        for (const item of block.items) {
          const isBoldItem = /^\*\*(.+)\*\*$/.test(item.trim());
          if (isBoldItem) {
            const boldItem = item.trim().replace(/^\*\*/, '').replace(/\*\*$/, '');
            paragraphs.push(new Paragraph({
              children: [
                new TextRun({ text: block.listType === 'ul' ? '  \u2022  ' : '  1.  ', size: 24, font: 'Microsoft JhengHei' }),
                new TextRun({ text: boldItem, bold: true, size: 24, font: 'Microsoft JhengHei' }),
              ],
              spacing: { before: 60, after: 60, line: 360 },
              indent: { left: convertInchesToTwip(0.5) },
            }));
          } else {
            const bullet = block.listType === 'ul' ? '\u2022' : '\u25CB';
            paragraphs.push(new Paragraph({
              children: [
                new TextRun({ text: `  ${bullet}  `, size: 24, font: 'Microsoft JhengHei' }),
                ...parseInlineRuns(item),
              ],
              spacing: { before: 60, after: 60, line: 360 },
              indent: { left: convertInchesToTwip(0.5) },
            }));
          }
        }
        break;

      case 'hr':
        paragraphs.push(new Paragraph({
          children: [new TextRun({ text: '·  ·  ·  ·  ·  ·  ·  ·  ·', color: 'AAAAAA', size: 24, font: 'Microsoft JhengHei' })],
          spacing: { before: 300, after: 300 },
          alignment: AlignmentType.CENTER,
        }));
        break;

      case 'blockquote':
        for (const bql of block.lines) {
          paragraphs.push(new Paragraph({
            children: parseInlineRuns(bql, { italic: true }),
            spacing: { before: 60, after: 60, line: 360 },
            indent: { left: convertInchesToTwip(0.8), right: convertInchesToTwip(0.5) },
            border: {
              left: { style: BorderStyle.SINGLE, size: 6, color: 'CCCCCC', space: 10 },
            },
          }));
        }
        break;
    }
  }

  return paragraphs;
}

// ---- Build document ----
async function buildDocument() {
  const allParagraphs = [];

  // ---- COVER PAGE ----
  allParagraphs.push(new Paragraph({ spacing: { before: 4000 } })); // Top spacing

  // Decorative line
  allParagraphs.push(new Paragraph({
    children: [new TextRun({ text: '━'.repeat(20), color: '8B7355', size: 28, font: 'Microsoft JhengHei' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 600 },
  }));

  // Book title
  allParagraphs.push(new Paragraph({
    children: [new TextRun({
      text: BOOK_TITLE,
      bold: true,
      size: 56, // 28pt
      font: 'Microsoft JhengHei',
      color: '333333',
    })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
  }));

  // Subtitle
  allParagraphs.push(new Paragraph({
    children: [new TextRun({
      text: BOOK_SUBTITLE,
      size: 32, // 16pt
      font: 'Microsoft JhengHei',
      color: '666666',
      italics: true,
    })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 600 },
  }));

  // Decorative line
  allParagraphs.push(new Paragraph({
    children: [new TextRun({ text: '━'.repeat(20), color: '8B7355', size: 28, font: 'Microsoft JhengHei' })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 800 },
  }));

  // Author
  allParagraphs.push(new Paragraph({
    children: [new TextRun({
      text: AUTHOR,
      size: 28,
      font: 'Microsoft JhengHei',
      color: '444444',
    })],
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
  }));

  // Page break after cover
  allParagraphs.push(new Paragraph({ children: [new PageBreak()] }));

  // ---- TABLE OF CONTENTS ----
  allParagraphs.push(new Paragraph({
    children: [new TextRun({ text: '目  錄', bold: true, size: 40, font: 'Microsoft JhengHei', color: '333333' })],
    alignment: AlignmentType.CENTER,
    spacing: { before: 400, after: 600 },
    thematicBreak: true,
  }));

  // TOC entries
  allParagraphs.push(new Paragraph({
    children: [new TextRun({ text: '前言　為什麼我會寫這本書', size: 24, font: 'Microsoft JhengHei' })],
    spacing: { before: 100, after: 100 },
  }));
  allParagraphs.push(new Paragraph({ children: [new TextRun({ text: ' ' })], spacing: { after: 100 } }));

  const tocEntries = [
    ['第一篇　覺察　為什麼我會對孩子失控？', true],
    ['　第一章　致新手爸媽：你不是不夠好，你是承受太多', false],
    ['　第二章　那個罵你的聲音，其實是過去的回音', false],
    ['　第三章　自我慈悲：你不是壞媽媽，你只是累了', false],
    ['第二篇　修復　抱抱那個曾經「太乖」的自己', true],
    ['　第四章　有一種毒叫童年創傷：你的身體從未忘記', false],
    ['　第五章　乖孩子的代價：那些「太安靜」的孩子，正在吞下什麼？', false],
    ['　第六章　羞愧感：愛自己前的最後一道門', false],
    ['第三篇　實踐　不必急著教，先學會陪伴', true],
    ['　第七章　天下無不是的父母？當然有', false],
    ['　第八章　原來我們都在重新養自己一遍', false],
    ['　第九章　復原力：受傷了，還能好好長大', false],
    ['第四篇　傳承　給孩子一份不帶傷痕的愛', true],
    ['　第十章　孩子成功不是靠智商，是靠「大腦 CEO」', false],
    ['　第十一章　再滑手機我就沒收？你搞錯重點了', false],
    ['　第十二章　大寶的微創傷：手足之間那些沒說出口的話', false],
    ['後記', true],
  ];

  for (const [entry, isBold] of tocEntries) {
    const isPart = entry.startsWith('第') && !entry.startsWith('　第');
    allParagraphs.push(new Paragraph({
      children: [new TextRun({
        text: entry,
        bold: isBold || isPart,
        size: isPart ? 26 : 24,
        font: 'Microsoft JhengHei',
        color: isPart ? '333333' : '555555',
      })],
      spacing: { before: isPart ? 200 : 80, after: 80 },
      ...(isPart ? {} : { indent: { left: isPart ? 0 : convertInchesToTwip(0.3) } }),
    }));
  }

  // Page break after TOC
  allParagraphs.push(new Paragraph({ children: [new PageBreak()] }));

  // ---- CHAPTERS ----
  let currentPart = 0;

  for (const chap of CHAPTERS) {
    const filePath = path.join(BOOK_DIR, chap.file);
    const md = fs.readFileSync(filePath, 'utf-8');

    // Add part divider if part changes
    if (chap.part && chap.part !== currentPart) {
      currentPart = chap.part;

      // Part page
      const partInfo = PART_TITLES[chap.part];
      allParagraphs.push(new Paragraph({
        children: [new TextRun({ text: '·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·', color: 'CCCCCC', size: 24, font: 'Microsoft JhengHei' })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 2400, after: 200 },
      }));

      allParagraphs.push(new Paragraph({
        children: [new TextRun({
          text: partInfo.title,
          bold: true,
          size: 36,
          font: 'Microsoft JhengHei',
          color: '444444',
        })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 },
      }));

      allParagraphs.push(new Paragraph({
        children: [new TextRun({
          text: partInfo.subtitle,
          size: 28,
          font: 'Microsoft JhengHei',
          color: '666666',
        })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 100, after: 200 },
      }));

      allParagraphs.push(new Paragraph({
        children: [new TextRun({ text: '·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·', color: 'CCCCCC', size: 24, font: 'Microsoft JhengHei' })],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 600 },
      }));

      // Page break after part title
      allParagraphs.push(new Paragraph({ children: [new PageBreak()] }));
    }

    // Parse markdown and add paragraphs
    const blocks = parseMarkdown(md);
    const paragraphs = blocksToParagraphs(blocks);
    allParagraphs.push(...paragraphs);

    // Add page break after each chapter (except the last one)
    if (chap !== CHAPTERS[CHAPTERS.length - 1]) {
      allParagraphs.push(new Paragraph({ children: [new PageBreak()] }));
    }
  }

  // ---- Create Document ----
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: 'Microsoft JhengHei',
            size: 24, // 12pt
          },
          paragraph: {
            spacing: { line: 400 },
          },
        },
        heading1: {
          run: {
            font: 'Microsoft JhengHei',
            size: 40, // 20pt
            bold: true,
            color: '333333',
          },
          paragraph: {
            spacing: { before: 600, after: 300 },
            thematicBreak: true,
          },
        },
        heading2: {
          run: {
            font: 'Microsoft JhengHei',
            size: 32, // 16pt
            bold: true,
            color: '444444',
          },
          paragraph: {
            spacing: { before: 400, after: 200 },
          },
        },
        heading3: {
          run: {
            font: 'Microsoft JhengHei',
            size: 28, // 14pt
            bold: true,
            color: '555555',
          },
          paragraph: {
            spacing: { before: 300, after: 150 },
          },
        },
      },
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1.2),
            bottom: convertInchesToTwip(1.2),
            left: convertInchesToTwip(1.0),
            right: convertInchesToTwip(1.0),
          },
        },
      },
      headers: {
        default: new Header({
          children: [new Paragraph({
            children: [new TextRun({
              text: BOOK_TITLE,
              italics: true,
              size: 18,
              color: 'AAAAAA',
              font: 'Microsoft JhengHei',
            })],
            alignment: AlignmentType.RIGHT,
          })],
        }),
      },
      footers: {
        default: new Footer({
          children: [new Paragraph({
            children: [
              new TextRun({
                text: '— ',
                size: 18,
                color: 'AAAAAA',
                font: 'Microsoft JhengHei',
              }),
              new TextRun({
                children: [PageNumber.CURRENT],
                size: 18,
                color: 'AAAAAA',
                font: 'Microsoft JhengHei',
              }),
              new TextRun({
                text: ' —',
                size: 18,
                color: 'AAAAAA',
                font: 'Microsoft JhengHei',
              }),
            ],
            alignment: AlignmentType.CENTER,
          })],
        }),
      },
      children: allParagraphs,
    }],
  });

  // ---- Export ----
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUTPUT, buffer);
  console.log(`Book manuscript generated: ${OUTPUT}`);
  console.log(`File size: ${(buffer.length / 1024 / 1024).toFixed(2)} MB`);
}

buildDocument().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
