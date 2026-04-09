# Changelog

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
