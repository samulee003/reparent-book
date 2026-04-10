# Changelog

## 2026-04-10

### 初版審閱稿輸出

- 新增 `scripts/generate_review_draft.py`，以 `book/plan-c/` 正式稿為唯一來源，自動生成完整審閱版書稿。
- 產出 `book/當了父母，才開始重新養育自己_初版審閱稿_2026-04-10.md`，整合：
  - 封面主視覺方向
  - 封底文案
  - 風格設計與排版提案
  - 完整目錄
  - 前言、四篇分篇頁、12 章正文、後記

### 第七輪出版團隊深度審稿（核心框架對齊檢查）

- 全書 14 個檔案逐章深度審閱，聚焦核心框架（看見→命名→安頓→重寫 / 先安頓，再教養）的對齊度
- 修復以下 P1 問題：
  - **P1** ch08 L337/L349：「在結束這本書之前」「想留在這本書的最後」——ch08 非最後一章，修正措辭
  - **P1** ch07 本章小結：缺乏框架語言，加入「看見→命名→安頓→重寫」的明確錨定
  - **P1** ch11 從教養回到自己：缺乏「先安頓，再教養」的明確表述，已補充
  - **P1** ch10 §10.5/10.6：「充權賦能」「人在心也在的陪伴」重複出現，精簡 10.6 消除冗餘
- 核心框架對齊度評分：
  - 10/10：ch03（自我慈悲）、afterword
  - 9/10：foreword、ch02（內在批評者）、ch08（重新養育自己）
  - 8/10：ch04（童年創傷）、ch06（羞愧感）、ch10（執行功能）
  - 7/10：ch01（新手爸媽）、ch05（乖孩子）、ch09（復原力）、ch12（手足）
  - 6/10：ch07（面對上一代）、ch11（3C 螢幕）
- 確認通過：簡體字 ✅、禁用 AI 用語 ✅、術語統一 ✅、「雙鏡面教養」未出現 ✅、臨床視角 callout 10/14 章有 ✅

### 第六輪全面審稿（plan-c 正式稿）

- 全書 14 個檔案逐章審閱，修復以下問題：
  - **P0** ch09：小傑/小杰 簡繁不一致（杰 → 傑），全部統一為繁體「傑」
  - **P1** ch05：術語違規「情感忽視」→「童年情感忽視」
  - **P1** ch09：妳/你 代名詞錯誤，對男孩角色小傑應使用「你」
  - **P1** ch09：阿傑 改名為 阿凱，避免與同章小傑混淆
  - **P1** ch10：本章小結中孤立的項目符號與格式錯誤修正
  - **P1** ch12：本章小結中孤立的項目符號修正
- 確認通過項目：簡體字 ✅、禁用 AI 用語 ✅、術語統一 ✅、章節編號無重複 ✅、核心框架對齊（前言＋後記皆引用）✅

### Core Framework + Documentation Sync

- Clarified the manuscript's explicit core framework in the canonical `book/plan-c/` manuscript:
  - **先安頓，再教養**
  - **看見 → 命名 → 安頓 → 重寫**
  - **育兒，不只是養孩子，也是重新養育自己**
- Updated documentation files to match the current source of truth and final framing:
  - `README.md`
  - `agent.md`
  - `book/agent.md`
- Corrected editing guidance so `book/plan-c/` is treated as the only current manuscript source, while `book/02_contents/` remains a historical backup.

## 2026-04-09

### Book Manuscript

- Reworked the manuscript from source-material integration rather than preserving earlier report-driven grouping.
- Strengthened the book spine so it reads as a continuous parenting-and-repair manuscript instead of a sequence of adapted Facebook posts.
- Rewrote and expanded the weakest structural chapters:
  - `book/02_contents/ch04.md`
  - `book/02_contents/ch05.md`
  - `book/02_contents/ch06.md`
  - `book/02_contents/ch08.md`
  - `book/02_contents/ch10.md`
  - `book/02_contents/ch11.md`
- Performed a structure-cleanup pass across the manuscript:
  - removed chapter-end appendices and sidebars that pulled the book back toward article/column form
  - replaced workshop-style bridge copy with book-style transitions
  - removed duplicate/competing end-material inside chapter 12 so the book lands once, in the actual afterword
  - reduced template/worksheet language in practical chapters and rewrote it as narrative prose

### Assembled Outputs

- Generated consolidated manuscript files under `book/`, including a structure-revised master manuscript:
  - `book/當了父母，才開始重新養育自己_結構修正版_2026-04-09.md`
- Generated Word export tooling and multiple `.docx` outputs for readable publisher-style layouts.

### Tooling

- Added `scripts/md_to_publisher_docx.py` to convert the manuscript into a styled `.docx` with cover, contents page, headings, page layout, and running pagination.

### Project Notes

- Confirmed that earlier high character counts in the merged markdown included duplicated tail sections from several chapters.
- Normalized the working version toward a cleaner book structure rather than preserving duplicated article fragments for raw count inflation.
