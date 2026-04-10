/**
 * 全書稿 DOCX 生成腳本
 * 《當了父母，才開始重新養育自己：心理師的覺察式育兒練習》
 * 
 * 功能：封面 → 目錄 → 前言 → 12章 → 後記
 * 排版：含篇名頁、章節標題、小節標題、正文縮排
 */

import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, PageBreak, TableOfContents, StyleLevel,
  LevelFormat, Tab, TabStopType, TabStopPosition,
  convertInchesToTwip, Header, Footer, PageNumber,
  NumberFormat, BorderStyle, ShadingType,
  SectionType, PageOrientation, LineRuleType
} from "docx";
import fs from "fs";
import path from "path";

const BASE = path.resolve("c:/Users/senghangl/WorkBuddy/Claw/book/plan-c");
const OUTPUT = path.resolve("c:/Users/senghangl/WorkBuddy/Claw/book/plan-c/當了父母才開始重新養育自己_完整書稿.docx");

// 書籍資訊
const BOOK_TITLE = "當了父母，才開始重新養育自己";
const BOOK_SUBTITLE = "心理師的覺察式育兒練習";
const AUTHOR = "鋅鋰師拔麻";

// 篇章結構
const PARTS = [
  {
    title: "第一篇　覺察",
    subtitle: "為什麼我會對孩子失控？",
    chapters: ["ch01.md", "ch02.md", "ch03.md"]
  },
  {
    title: "第二篇　修復",
    subtitle: "抱抱那個曾經「太乖」的自己",
    chapters: ["ch04.md", "ch05.md", "ch06.md"]
  },
  {
    title: "第三篇　實踐",
    subtitle: "不必急著教，先學會陪伴",
    chapters: ["ch07.md", "ch08.md", "ch09.md"]
  },
  {
    title: "第四篇　傳承",
    subtitle: "給孩子一份不帶傷痕的愛",
    chapters: ["ch10.md", "ch11.md", "ch12.md"]
  }
];

// ─── Markdown 解析 ───

function parseMarkdown(content) {
  const lines = content.split("\n");
  const blocks = [];
  let currentParagraph = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 空行 → 推出段落
    if (trimmed === "") {
      if (currentParagraph.length > 0) {
        blocks.push({ type: "paragraph", text: currentParagraph.join("").trim() });
        currentParagraph = [];
      }
      continue;
    }

    // ### 小節標題
    if (trimmed.startsWith("### ")) {
      if (currentParagraph.length > 0) {
        blocks.push({ type: "paragraph", text: currentParagraph.join("").trim() });
        currentParagraph = [];
      }
      blocks.push({ type: "heading3", text: trimmed.slice(4) });
      continue;
    }

    // ## 章節標題 (跳過，我們用手動標題)
    if (trimmed.startsWith("## ")) {
      if (currentParagraph.length > 0) {
        blocks.push({ type: "paragraph", text: currentParagraph.join("").trim() });
        currentParagraph = [];
      }
      blocks.push({ type: "heading2", text: trimmed.slice(3) });
      continue;
    }

    // # 一級標題 (跳過)
    if (trimmed.startsWith("# ")) {
      if (currentParagraph.length > 0) {
        blocks.push({ type: "paragraph", text: currentParagraph.join("").trim() });
        currentParagraph = [];
      }
      blocks.push({ type: "heading1", text: trimmed.slice(2) });
      continue;
    }

    // 引用（> 開頭）
    if (trimmed.startsWith("> ")) {
      if (currentParagraph.length > 0) {
        blocks.push({ type: "paragraph", text: currentParagraph.join("").trim() });
        currentParagraph = [];
      }
      blocks.push({ type: "quote", text: trimmed.slice(2) });
      continue;
    }

    // 列表（- 或 * 開頭）
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (currentParagraph.length > 0) {
        blocks.push({ type: "paragraph", text: currentParagraph.join("").trim() });
        currentParagraph = [];
      }
      blocks.push({ type: "listitem", text: trimmed.slice(2) });
      continue;
    }

    // 編號列表
    const numMatch = trimmed.match(/^(\d+)[.、)]\s/);
    if (numMatch) {
      if (currentParagraph.length > 0) {
        blocks.push({ type: "paragraph", text: currentParagraph.join("").trim() });
        currentParagraph = [];
      }
      blocks.push({ type: "listitem", text: trimmed.replace(/^\d+[.、)]\s/, "") });
      continue;
    }

    // 水平線
    if (trimmed === "---" || trimmed === "***" || trimmed === "___") {
      if (currentParagraph.length > 0) {
        blocks.push({ type: "paragraph", text: currentParagraph.join("").trim() });
        currentParagraph = [];
      }
      blocks.push({ type: "hr" });
      continue;
    }

    // 一般文字 — 處理行內格式
    currentParagraph.push(parseInlineFormatting(trimmed));
  }

  if (currentParagraph.length > 0) {
    blocks.push({ type: "paragraph", text: currentParagraph.join("").trim() });
  }

  return blocks;
}

function parseInlineFormatting(text) {
  // 處理粗斜體 ***text*** → bold+italic
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, "«B3$1E3»");
  // 處理粗體 **text** → bold
  text = text.replace(/\*\*(.+?)\*\*/g, "«B$1E»");
  // 處理斜體 *text* → italic
  text = text.replace(/\*(.+?)\*/g, "«I$1E»");
  // 處理刪除線 ~~text~~
  text = text.replace(/~~(.+?)~~/g, "«S$1E»");
  return text;
}

// ─── 區塊轉 Paragraph ───

function blocksToParagraphs(blocks) {
  const paragraphs = [];

  for (const block of blocks) {
    switch (block.type) {
      case "heading1":
        // Skip — handled externally
        break;
      case "heading2":
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: block.text,
                bold: true,
                size: 32, // 16pt
                font: "Microsoft JhengHei",
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 480, after: 240 },
          })
        );
        break;

      case "heading3":
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({
                text: block.text,
                bold: true,
                size: 28, // 14pt
                font: "Microsoft JhengHei",
              }),
            ],
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 360, after: 200 },
          })
        );
        break;

      case "quote":
        paragraphs.push(
          new Paragraph({
            children: formatInlineRuns(block.text, { italics: true, size: 22, color: "555555" }),
            indent: { left: convertInchesToTwip(0.5), right: convertInchesToTwip(0.5) },
            spacing: { before: 200, after: 200, line: 360 },
            border: {
              left: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC", space: 10 },
            },
          })
        );
        break;

      case "listitem":
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: "• ", size: 24, font: "Microsoft JhengHei" }),
              ...formatInlineRuns(block.text, { size: 24 }),
            ],
            spacing: { before: 80, after: 80, line: 360 },
            indent: { left: convertInchesToTwip(0.3), hanging: convertInchesToTwip(0.2) },
          })
        );
        break;

      case "hr":
        paragraphs.push(
          new Paragraph({
            children: [],
            spacing: { before: 200, after: 200 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 2, color: "CCCCCC", space: 1 },
            },
          })
        );
        break;

      case "paragraph":
        if (!block.text) continue;
        paragraphs.push(
          new Paragraph({
            children: formatInlineRuns(block.text, { size: 24 }),
            spacing: { before: 0, after: 160, line: 400 },
            indent: { firstLine: convertInchesToTwip(0.3) },
          })
        );
        break;
    }
  }

  return paragraphs;
}

function formatInlineRuns(text, baseStyle = {}) {
  const runs = [];
  const { size = 24, bold = false, italics = false, color = "333333", font = "Microsoft JhengHei" } = baseStyle;

  // 解析自訂標記 «B» «I» «S» «B3»
  const regex = /«(B3?|I|S)(.+?)E»|([^«»]+)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match[1]) {
      const tag = match[1];
      const content = match[2];
      runs.push(
        new TextRun({
          text: content,
          bold: bold || tag === "B" || tag === "B3",
          italics: italics || tag === "I" || tag === "B3",
          strike: tag === "S",
          size,
          color,
          font,
        })
      );
    } else {
      runs.push(
        new TextRun({
          text: match[3],
          bold,
          italics,
          size,
          color,
          font,
        })
      );
    }
  }

  if (runs.length === 0) {
    runs.push(new TextRun({ text, bold, italics, size, color, font }));
  }

  return runs;
}

// ─── 章節檔案讀取 ───

function readChapter(filename) {
  const filepath = path.join(BASE, filename);
  if (!fs.existsSync(filepath)) {
    console.warn(`⚠️ 檔案不存在: ${filepath}`);
    return null;
  }
  return fs.readFileSync(filepath, "utf-8");
}

// ─── 封面頁 ───

function createCoverPage() {
  return [
    // 上方留白
    new Paragraph({ children: [], spacing: { before: 4000 } }),
    new Paragraph({ children: [], spacing: { before: 2000 } }),
    // 書名
    new Paragraph({
      children: [
        new TextRun({
          text: BOOK_TITLE,
          bold: true,
          size: 56, // 28pt
          font: "Microsoft JhengHei",
          color: "2C3E50",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    // 副書名
    new Paragraph({
      children: [
        new TextRun({
          text: BOOK_SUBTITLE,
          size: 32, // 16pt
          font: "Microsoft JhengHei",
          color: "7F8C8D",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 1200 },
    }),
    // 裝飾線
    new Paragraph({
      children: [
        new TextRun({
          text: "— — — — — — — — —",
          size: 20,
          color: "BDC3C7",
          font: "Microsoft JhengHei",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 800 },
    }),
    // 作者
    new Paragraph({
      children: [
        new TextRun({
          text: AUTHOR,
          size: 28,
          font: "Microsoft JhengHei",
          color: "34495E",
          bold: true,
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
    // 說明
    new Paragraph({
      children: [
        new TextRun({
          text: "覺察式育兒 × 自我療癒 × 心理專業",
          size: 20,
          font: "Microsoft JhengHei",
          color: "95A5A6",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 4000 },
    }),
    // 版本
    new Paragraph({
      children: [
        new TextRun({
          text: "初稿 — 2026 年 4 月",
          size: 20,
          font: "Microsoft JhengHei",
          color: "95A5A6",
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
  ];
}

// ─── 篇名頁 ───

function createPartPage(partTitle, partSubtitle) {
  return [
    new Paragraph({ children: [], spacing: { before: 4000 } }),
    new Paragraph({
      children: [
        new TextRun({
          text: partTitle,
          bold: true,
          size: 44, // 22pt
          font: "Microsoft JhengHei",
          color: "2C3E50",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 300 },
    }),
    new Paragraph({
      children: [
        new TextRun({
          text: partSubtitle,
          size: 28,
          font: "Microsoft JhengHei",
          color: "7F8C8D",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { after: 2000 } },
    ),
    // 裝飾線
    new Paragraph({
      children: [
        new TextRun({
          text: "·  ·  ·",
          size: 24,
          color: "BDC3C7",
          font: "Microsoft JhengHei",
        }),
      ],
      alignment: AlignmentType.CENTER,
    }),
  ];
}

// ─── 主函式 ───

async function main() {
  console.log("📄 開始生成 DOCX 書稿...\n");

  const allParagraphs = [];

  // 1. 封面
  console.log("✅ 封面");
  allParagraphs.push(...createCoverPage());

  // 分頁
  allParagraphs.push(
    new Paragraph({ children: [], pageBreakBefore: true })
  );

  // 2. 目錄頁
  console.log("✅ 目錄");
  allParagraphs.push(
    new Paragraph({
      children: [
        new TextRun({
          text: "目　　錄",
          bold: true,
          size: 40,
          font: "Microsoft JhengHei",
          color: "2C3E50",
        }),
      ],
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 600 },
    })
  );

  // 手動目錄
  const tocEntries = [
    { text: "前言　在育兒中，遇見那個被遺忘的自己", indent: 0 },
    { text: "", indent: 0 },
    { text: "第一篇　覺察　為什麼我會對孩子失控？", indent: 0, bold: true },
    { text: "第一章　那個被觸發的自己", indent: 1 },
    { text: "第二章　情緒不是壞東西", indent: 1 },
    { text: "第三章　乖孩子的代價", indent: 1 },
    { text: "", indent: 0 },
    { text: "第二篇　修復　抱抱那個曾經「太乖」的自己", indent: 0, bold: true },
    { text: "第四章　童年創傷不是你的錯", indent: 1 },
    { text: "第五章　那些「太乖」的孩子，後來怎麼了？", indent: 1 },
    { text: "第六章　重新養自己，不是自私", indent: 1 },
    { text: "", indent: 0 },
    { text: "第三篇　實踐　不必急著教，先學會陪伴", indent: 0, bold: true },
    { text: "第七章　在長輩面前堅持你的教養方式", indent: 1 },
    { text: "第八章　允許自己當一個「不完美」的父母", indent: 1 },
    { text: "第九章　培養孩子的心理韌性", indent: 1 },
    { text: "", indent: 0 },
    { text: "第四篇　傳承　給孩子一份不帶傷痕的愛", indent: 0, bold: true },
    { text: "第十章　把情緒的詞彙教給孩子", indent: 1 },
    { text: "第十一章　手足之間的愛與爭奪", indent: 1 },
    { text: "第十二章　給未來的自己，也給未來的孩子", indent: 1 },
    { text: "", indent: 0 },
    { text: "後記　寫給每一位正在努力的你", indent: 0 },
  ];

  for (const entry of tocEntries) {
    if (entry.text === "") {
      allParagraphs.push(new Paragraph({ children: [], spacing: { before: 100 } }));
      continue;
    }
    allParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: entry.text,
            size: entry.bold ? 24 : 22,
            bold: !!entry.bold,
            font: "Microsoft JhengHei",
            color: entry.bold ? "2C3E50" : "333333",
          }),
        ],
        indent: { left: convertInchesToTwip(entry.indent * 0.3) },
        spacing: { before: 60, after: 60 },
      })
    );
  }

  // 3. 前言
  console.log("✅ 前言");
  allParagraphs.push(
    new Paragraph({ children: [], pageBreakBefore: true })
  );
  const foreword = readChapter("foreword.md");
  if (foreword) {
    allParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "前言",
            bold: true,
            size: 40,
            font: "Microsoft JhengHei",
            color: "2C3E50",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 },
      })
    );
    allParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "在育兒中，遇見那個被遺忘的自己",
            size: 24,
            font: "Microsoft JhengHei",
            color: "7F8C8D",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
      })
    );
    const blocks = parseMarkdown(foreword);
    allParagraphs.push(...blocksToParagraphs(blocks));
  }

  // 4. 各篇章
  let chapterNum = 0;
  for (const part of PARTS) {
    console.log(`✅ ${part.title}`);

    // 篇名頁
    allParagraphs.push(
      new Paragraph({ children: [], pageBreakBefore: true })
    );
    allParagraphs.push(...createPartPage(part.title, part.subtitle));

    for (const chFile of part.chapters) {
      chapterNum++;
      const content = readChapter(chFile);
      if (!content) continue;

      // 章節標題頁
      allParagraphs.push(
        new Paragraph({ children: [], pageBreakBefore: true })
      );

      // 提取章名（從 ## 後的文字）
      const titleMatch = content.match(/^## (.+)/m);
      const chapterTitle = titleMatch ? titleMatch[1] : `第${chapterNum}章`;

      allParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `第${["一","二","三","四","五","六","七","八","九","十","十一","十二"][chapterNum-1]}章`,
              size: 20,
              font: "Microsoft JhengHei",
              color: "95A5A6",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 1200, after: 100 },
        })
      );
      allParagraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: chapterTitle,
              bold: true,
              size: 40,
              font: "Microsoft JhengHei",
              color: "2C3E50",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 800 },
        })
      );

      // 章節內容
      const blocks = parseMarkdown(content);
      allParagraphs.push(...blocksToParagraphs(blocks));
    }
  }

  // 5. 後記
  console.log("✅ 後記");
  allParagraphs.push(
    new Paragraph({ children: [], pageBreakBefore: true })
  );
  const afterword = readChapter("afterword.md");
  if (afterword) {
    allParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "後記",
            bold: true,
            size: 40,
            font: "Microsoft JhengHei",
            color: "2C3E50",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 100 },
      })
    );
    allParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "寫給每一位正在努力的你",
            size: 24,
            font: "Microsoft JhengHei",
            color: "7F8C8D",
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 600 },
      })
    );
    const blocks = parseMarkdown(afterword);
    allParagraphs.push(...blocksToParagraphs(blocks));
  }

  // ─── 建立 Document ───

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Microsoft JhengHei",
            size: 24,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1.2),
              right: convertInchesToTwip(1.2),
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: BOOK_TITLE,
                    size: 16,
                    font: "Microsoft JhengHei",
                    color: "BDC3C7",
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 18,
                    font: "Microsoft JhengHei",
                    color: "95A5A6",
                  }),
                ],
                alignment: AlignmentType.CENTER,
              }),
            ],
          }),
        },
        children: allParagraphs,
      },
    ],
  });

  // ─── 寫入檔案 ───
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(OUTPUT, buffer);
  console.log(`\n🎉 書稿已生成: ${OUTPUT}`);
  console.log(`📊 檔案大小: ${(buffer.length / 1024).toFixed(1)} KB`);
}

main().catch((err) => {
  console.error("❌ 生成失敗:", err);
  process.exit(1);
});
