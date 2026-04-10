# CLAUDE.md — AI Assistant Guide for reparent-book

> This file provides essential context for AI assistants working on this repository. Read it before making any edits to the manuscript or tooling.

---

## Project Identity

This is a **Traditional Chinese-language parenting psychology book** writing project, not a software application.

- **Book title**: 《當了父母，才開始重新養育自己：心理師的覺察式育兒練習》
- **Author**: 鋅鋰師拔麻 (a clinical psychologist and mother of two)
- **Target readers**: Parents aged 25–45, especially those who were "good/compliant children" growing up
- **Core thesis**: Children's behavioral issues often trigger parents' unresolved childhood trauma; healing comes through self-awareness, self-repair, and self-compassion
- **Theoretical framework**: IFS (Internal Family Systems / 內在家庭系統), Polyvagal Theory (多重迷走神經理論), Schema Therapy (基模治療)
- **Current word count**: 82,842 Chinese characters across 14 files
- **Status**: Post-5th-review pass; awaiting final typesetting

---

## Repository Structure

```
reparent-book/
├── CLAUDE.md                     # This file
├── README.md                     # Project overview (Traditional Chinese)
├── agent.md                      # AI collaboration guidelines & style rules
├── changelog.md                  # Change history
│
├── book/                         # Primary manuscript directory
│   ├── 01_contents_keyPoints/    # Chapter outlines and structural planning
│   │   └── full_outline.md       # Complete 4-part outline with material mapping
│   ├── 02_contents/              # WORKING CHAPTER FILES (edit these)
│   │   ├── foreword.md           # 前言 (~942 chars)
│   │   ├── ch01.md – ch12.md     # 12 chapters
│   │   └── afterword.md          # 後記 (~880 chars)
│   ├── 04_images/                # Book illustrations
│   ├── 99_material/              # Source material library
│   │   ├── all_long_posts.txt    # All 689 FB posts (~425,000 chars)
│   │   ├── key_posts_full.txt    # 24 core posts (133 KB)
│   │   ├── detailed_map.md       # 22-category thematic index of posts
│   │   └── chapter_posts/        # Posts organized by chapter relevance
│   ├── docs/                     # Editorial review reports (5 rounds)
│   ├── scripts/                  # Automation: merge, word count, categorization
│   ├── 當了父母…_結構修正版_2026-04-09.md   # Latest integrated manuscript
│   └── 當了父母…_完整書稿_2026-04-09.md     # Reference merged manuscript
│
├── scripts/
│   └── md_to_publisher_docx.py   # Markdown → publisher-ready DOCX export
│
├── src/
│   └── ch03_trial.md             # Trial chapter (for publisher samples)
│
└── fb_posts_fixed.json           # UTF-8 corrected FB post archive (use this, not originals)
```

---

## Book Architecture

Four-part structure:

| Part | Theme | Chapters | Core Question |
|------|-------|----------|---------------|
| 第一篇 | 覺察 (Awareness) | ch01–03 | Why do I lose control with my child? |
| 第二篇 | 修復 (Repair) | ch04–06 | How do I heal my childhood wounds? |
| 第三篇 | 實踐 (Practice) | ch07–09 | How do I parent differently? |
| 第四篇 | 傳承 (Legacy) | ch10–12 | How do I break the generational cycle? |

### Chapter Titles (current canonical version)

| File | Title |
|------|-------|
| foreword.md | 前言：為什麼我會寫這本書 |
| ch01.md | 致新手爸媽：你不是不夠好，你是承受太多 |
| ch02.md | 有一種毒叫童年創傷：你的身體從未忘記 |
| ch03.md | 乖孩子的代價：那些「太安靜」的孩子，正在吞下什麼？ |
| ch04.md | 那個罵你的聲音，其實是過去的回音 |
| ch05.md | 羞愧感：愛自己前的最後一道門 |
| ch06.md | 自我慈悲：你不是壞媽媽，你只是累了 |
| ch07.md | 孩子成功不是靠智商，是靠「大腦 CEO」 |
| ch08.md | 再滑手機我就沒收？你搞錯重點了 |
| ch09.md | 大寶的微創傷：手足之間那些沒說出口的話 |
| ch10.md | 天下無不是的父母？當然有 |
| ch11.md | 復原力：受傷了，還能好好長大 |
| ch12.md | 原來我們都在重新養自己一遍 |
| afterword.md | 後記 |

---

## Editing Rules

### Always edit chapter working files, never merged outputs

The authoritative source of truth is `book/02_contents/*.md`. The merged/combined files under `book/` are **outputs**, not inputs. Never edit them and feed changes back; always work on the individual chapter files.

### Structural quality over word count

Do not inflate word count by:
- Preserving duplicate tail sections or competing end-material
- Leaving old-draft residue in chapters
- Adding workshop-style appendices, sidebars, or templates

If a chapter has leftover structural noise (duplicate endings, old-draft fragments), clean that first before considering additions.

---

## Writing Style Conventions

### Core principles

- **Remove AI-speak**: Avoid overly neat parallel structures, formulaic transitions, empty inspirational language
- **Maintain warmth**: Write in a psychologist's voice — warm, not preachy
- **Story-driven**: Every argument needs a concrete story or scene to ground it
- **Conversational register**: Feels like talking to the reader, but maintains book-manuscript density
- **Closure**: Each chapter must land cleanly; do not let chapters trail off into column-style addenda

### Forbidden patterns

These are actively prohibited in the manuscript:

| Pattern | Why banned |
|---------|-----------|
| 「讓我們一起」 | AI-speak filler |
| 「事實上」「不可否認」 | AI-speak filler |
| Three-part mechanical essays (論點→舉例→小結) repeated mechanically | Creates lecture feel, not book feel |
| Forced 「所以，……」 summaries at paragraph end | Unnatural, AI-patterned |
| Over-dramatized emotions | Loses credibility |
| Fill-in worksheets, questionnaires, lecture templates mid-chapter | Belongs in appendix only, not prose chapters |
| 「帶回家的練習」「這一週請你」 | Workshop tone, not book tone |
| 「第一篇到這裡」「接下來我們來」 | Lecture/classroom transitions |

### Mandatory terminology (standardized across all chapters)

| Use this | Not this |
|----------|----------|
| 童年情感忽視 | 情感忽視 |
| 自我慈悲 | 自我關懷 |
| Time Out | time out |

---

## Structural Quality Criteria

Every chapter must:

1. **Treat one main question** — a chapter with two competing central problems needs to be split or refocused
2. **Not have orphaned appendices** — no chapter-end templates, exercises, or side articles unless the book explicitly designates an appendix section
3. **Have a clear inter-chapter transition** — chapters should create narrative momentum into the next, not simply announce "next we discuss X"
4. **Read as a book, not a Facebook post compilation** — the author's source material is 689 FB posts; the job is to synthesize them into a continuous manuscript voice

---

## Review History & Current State

Five editorial passes have been completed:

| Round | Focus | Status |
|-------|-------|--------|
| Round 1 | Remove AI-speak, unify terminology, eliminate cross-chapter duplication | ✅ Done |
| Round 2 | Structural logic, cross-chapter consistency, incorporate unused material | ✅ Done |
| Round 3 | Overall book feel, chapter closings, transitions (rated 9.0/10) | ✅ Done |
| Round 4 | Structural fixes, duplicate/residual draft cleanup (rated 9.5/10) | ✅ Done |
| Clinical integration | Added IFS, Polyvagal Theory, Schema Therapy call-outs throughout | ✅ Done |

### Review priority levels

When reviewing or editing, apply fixes in this priority order:

- **P0**: Factual errors, logical contradictions, off-thesis content, duplicate residual drafts
- **P1**: Loose structure, abrupt transitions, chapters that read like posts instead of book chapters
- **P2**: Fine-tuning, language polish, tonal adjustments

---

## Available Scripts

### Export to DOCX

```bash
python scripts/md_to_publisher_docx.py
```

Converts the manuscript into a styled publisher-ready `.docx` with cover page, table of contents, styled headings, page layout, and running pagination. Reads from `book/02_contents/`.

### Merge all chapters

```bash
python book/scripts/merge_book.py
```

Concatenates all 14 chapter files in order into a single manuscript file.

### Other utility scripts in `book/scripts/`

| Script | Purpose |
|--------|---------|
| `merge_book_v2.py` | Alternative merge strategy |
| `final_merge.py` | Final consolidation pass |
| `categorize.py` | Sorts FB posts by theme |
| `extract_chapter_posts.py` | Extracts posts relevant to each chapter |
| `extract_key_posts.py` | Identifies the 24 core posts from 689 total |
| `format_spaces.py` | Text formatting cleanup |

---

## Source Material

- **689 long-form Facebook posts** by the author (~425,000 Chinese characters)
- Material organized under `book/99_material/`
- 22-category thematic index: `book/99_material/detailed_map.md`
- 24 core posts (pre-selected as most book-relevant): `book/99_material/key_posts_full.txt`
- Per-chapter post selections: `book/99_material/chapter_posts/`

**Important**: Always use `fb_posts_fixed.json` for programmatic access to posts, not the raw Facebook export (encoding issues with the original latin-1 source).

---

## Privacy & Ethics

- All client-related content in the manuscript has been de-identified (脫敏)
- When editing, maintain anonymization — do not re-introduce identifying details
- All post text and manuscript content is the author's original work; treat as proprietary

---

## Git Workflow

- **Working branch**: `claude/add-claude-documentation-Cv32I`
- **Remote**: `http://local_proxy@127.0.0.1:23517/git/samulee003/reparent-book`
- Commit message prefixes in use: `docs:`, `refactor:`, `fix:`
- After any significant editorial pass, update both `changelog.md` and `agent.md`
- Do not amend published commits; create new commits for corrections

### After completing a round of edits

1. Edit the individual chapter files in `book/02_contents/`
2. Run `merge_book.py` to regenerate the merged manuscript
3. Update `changelog.md` with a summary of what changed
4. Commit with a descriptive message
5. Push to the working branch

---

## Key File Quick Reference

| Need to... | Go to... |
|-----------|---------|
| Edit a chapter | `book/02_contents/ch##.md` |
| Check chapter structure plan | `book/01_contents_keyPoints/full_outline.md` |
| Find source FB material for a chapter | `book/99_material/chapter_posts/` |
| Review AI collaboration rules | `agent.md` |
| Check what changed recently | `changelog.md` |
| Generate publisher DOCX | `scripts/md_to_publisher_docx.py` |
| Read editorial feedback | `book/docs/` |
