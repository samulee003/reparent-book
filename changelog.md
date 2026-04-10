# Changelog

## 2026-04-10 — 亞馬遜榜首編輯視角第六輪修訂

### 核心目標

以「曾操刀多本亞馬遜育兒類榜首書籍的編輯」視角，針對本書從「可出版」到「榜首潛力」的關鍵缺口進行修補。本輪修訂聚焦於：讀者旅程感、貫穿角色、命名框架、情感高峰、聲音一致性。

### 章節修改

- **ch01.md、ch04.md、ch07.md、ch10.md**：各篇首新增「篇章引導頁」（blockquote 格式），200–300 字，給讀者重新入場的情感入口，補足四篇之間原本突然的切換感。

- **ch02.md**：在小雯的「情緒時光機」觸發瞬間後，插入作者原創命名框架「情緒時光機」（Emotional Time Machine）概念段落——這是全書第一個由作者命名的核心機制，可傳播、可引用，解決原版只引用別人框架（IFS / Polyvagal / Schema）的問題。

- **ch05.md**：在「面具」討論結束後，插入小薇的第二次諮商回顯——她第一次把問題從孩子轉向自己，為第五章的羞愧主題提供角色連結，同時強化小薇作為全書貫穿角色的存在感。

- **ch06.md**：重寫開頭。以「深夜一個人坐著，被自我批判的聲音淹沒」的具體場景取代原本的分析式開場，使第六章（全書情感核心）具備應有的情感重量與入場衝擊力。

- **ch07.md**：在五個執行功能訓練方法之後，插入「情感錨」段落——先問讀者「你小時候有沒有人這樣陪你」，再補入一個爸爸視角的真實案例（父親被掃落地板的課本 → 兒子的拖延 → 覺察連結），同時補足全書父親角色嚴重缺席的問題。

- **ch09.md**：在「微創傷定義」後，插入小薇關於大寶的諮商場景（四歲兒子吃醋、她與自己被忽視的舊傷之間的連結），讓手足章節有了跨章角色的情感支點。

- **ch12.md**：
  - 新增第 12.2 節「我自己是怎麼重新養自己的」——作者用女兒五歲時的一個週末午後場景，完整示範「情緒時光機被觸發 → 覺察 → 道歉 → 修復」的全流程，這是全書唯一以作者本人為主角的完整脆弱敘事，承擔最後一章應有的情感高峰功能。
  - 在第 12.7 節後（四個入口段落之後）新增全書最終收束段落——以「你正在做一件從來沒有人為你做過的事」為核心意象，呼應全書旅程，為讀者提供明確的「之後狀態」（after state）。
  - 舊 12.2–12.6 節依序重編為 12.3–12.7。

### 編輯診斷報告

- 完整診斷報告見 `/root/.claude/plans/dapper-swimming-thompson.md`，涵蓋十大缺口分析與 P0/P1/P2/P3 優先執行順序。

### 尚待處理（下一輪）

- 推薦序策動（聯繫洪仲清或陳志恆等人）
- 副標題重新評估（「覺察式育兒練習」→ 讀者利益導向）
- ch08、ch09 情感線補強（目前已改善 ch07）

---

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
