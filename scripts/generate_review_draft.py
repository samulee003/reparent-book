from __future__ import annotations

from datetime import datetime, timezone
from pathlib import Path


BOOK_TITLE = "當了父母，才開始重新養育自己"
BOOK_SUBTITLE = "心理師的覺察式育兒練習"
AUTHOR = "鋅鋰師拔麻"
VERSION_LABEL = "初版審閱稿"

REPO_ROOT = Path(__file__).resolve().parents[1]
BOOK_DIR = REPO_ROOT / "book" / "plan-c"
OUTPUT = REPO_ROOT / "book" / "當了父母，才開始重新養育自己_初版審閱稿_2026-04-10.md"

PARTS = [
    {
        "number": "第一篇",
        "title": "先停下來，看見自己",
        "subtitle": "看見自己，先讓人回來",
        "design_note": "用較多留白與安靜的頁面節奏，讓讀者一翻開就感受到：這不是一本教你把孩子管好的書，而是一本先讓父母回到自己身上的書。",
        "chapters": [
            "第一章 致新手爸媽：你不是不夠好，你是承受太多",
            "第二章 那個罵你的聲音，其實是過去的回音",
            "第三章 自我慈悲：你不是壞媽媽，你只是累了",
        ],
    },
    {
        "number": "第二篇",
        "title": "舊傷從哪裡來",
        "subtitle": "理解與命名舊傷來源",
        "design_note": "視覺上略微加深層次，讓讀者知道這一篇會進入更深的內在材料，但語氣仍然保持溫柔穩定，不做獵奇創傷敘事。",
        "chapters": [
            "第四章 有一種毒叫童年創傷：你的身體從未忘記",
            "第五章 乖孩子的代價：那些「太安靜」的孩子，正在吞下什麼？",
            "第六章 羞愧感：愛自己前的最後一道門",
            "第七章 天下無不是的父母？當然有",
        ],
    },
    {
        "number": "第三篇",
        "title": "重新養育自己",
        "subtitle": "安頓與修復自己",
        "design_note": "這是全書情感重心，篇章頁應刻意拉高存在感：加大標題、增加一句導言、保留更充足留白，讓讀者感覺自己真的走到了修復核心。",
        "chapters": [
            "第八章 原來我們都在重新養自己一遍",
            "第九章 復原力：受傷了，還能好好長大",
        ],
    },
    {
        "number": "第四篇",
        "title": "帶著覺察陪孩子長大",
        "subtitle": "把新的自己帶回教養現場，開始重寫",
        "design_note": "節奏重新往前走，版面回到更穩定、可實踐的閱讀感，讓最後三章像把修復後的力量帶回真實家庭生活。",
        "chapters": [
            "第十章 孩子成功不是靠智商，是靠「大腦 CEO」",
            "第十一章 再滑手機我就沒收？你搞錯重點了",
            "第十二章 大寶的微創傷：手足之間那些沒說出口的話",
        ],
    },
]

ORDERED_FILES = [
    ("foreword.md", None),
    ("ch01.md", 0),
    ("ch02.md", 0),
    ("ch03.md", 0),
    ("ch04.md", 1),
    ("ch05.md", 1),
    ("ch06.md", 1),
    ("ch07.md", 1),
    ("ch08.md", 2),
    ("ch09.md", 2),
    ("ch10.md", 3),
    ("ch11.md", 3),
    ("ch12.md", 3),
    ("afterword.md", None),
]


def load_markdown(name: str) -> str:
    return (BOOK_DIR / name).read_text(encoding="utf-8").strip()


def build_cover() -> str:
    date_str = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    return "\n".join(
        [
            "# 封面",
            "",
            f"**書名**：{BOOK_TITLE}",
            f"**副標**：{BOOK_SUBTITLE}",
            f"**作者**：{AUTHOR}",
            f"**版本**：{VERSION_LABEL}",
            f"**日期**：{date_str}",
            "",
            "## 封面主視覺方向",
            "",
            "- 主視覺不走雞湯式母嬰甜美照，而是以「一位父母抱著自己內在小孩」的隱喻感為核心。",
            "- 色系建議以奶茶米、霧灰藍、暖棕金為主，傳達安頓、修復、成熟感，而非高飽和親子教養感。",
            "- 書名字重最大，副標次之；作者名保持低調，讓整體先呈現信任與質感。",
            "",
            "## 封面短文案",
            "",
            "> 育兒，不只是養孩子，也是重新養育自己。",
            "> ",
            "> 當你被孩子觸怒、耗盡、擊潰，很多時候不是你不夠會教，",
            "> 而是你心裡那個曾經沒被好好接住的小孩，也正在哭。",
            "",
            "## 封底文案",
            "",
            "這不是一本教你快速搞定孩子的技巧書，而是一本陪你理解自己、安頓自己，再回到教養現場的書。",
            "",
            "從新手父母的崩潰、內在批評者、羞愧感、童年創傷、乖孩子的代價，到 3C 衝突、執行功能、手足微創傷與復原力，這本書一路要陪你走的，不只是育兒方法，而是一條重新看見自己、命名自己、安頓自己、最後慢慢重寫生命的路。",
            "",
            "---",
        ]
    )


def build_design_notes() -> str:
    lines = [
        "# 風格設計與排版提案",
        "",
        "## 整體風格",
        "",
        "- 基調：溫柔、安穩、誠實，不做過度療癒系包裝，也不走硬派理論書路線。",
        "- 閱讀感：像一位有臨床經驗的心理師坐在旁邊陪你說話，留有呼吸感，但仍保有書稿密度。",
        "- 關鍵視覺語言：留白、低彩度、穩定標題層級、篇章頁明顯區隔。",
        "",
        "## 內頁版型建議",
        "",
        "- 開本建議：25 開或接近尺寸，兼顧閱讀舒適與可攜性。",
        "- 字體建議：標題使用較乾淨的黑體；正文使用易讀的明體或宋體系字體。",
        "- 正文字級：11pt–12pt；行距 1.6–1.8；首行縮排一致。",
        "- 章首頁採單頁開章，保留較多上方留白，讓讀者在心理上有轉場空間。",
        "- `臨床視角` 區塊用淡色底或細線框處理，不要太像簡報提示框。",
        "",
        "## 篇章頁處理",
        "",
    ]

    for part in PARTS:
        lines.extend(
            [
                f"- **{part['number']}｜{part['title']}**：{part['design_note']}",
            ]
        )

    lines.extend(
        [
            "",
            "## 目錄呈現原則",
            "",
            "- 目錄先列四篇，再列各章，讓全書路徑清楚可見。",
            "- 第三篇 `重新養育自己` 在視覺上略作強調，呼應全書核心命題。",
            "",
            "---",
        ]
    )

    return "\n".join(lines)


def build_toc() -> str:
    lines = [
        "# 目錄",
        "",
        "- 前言：為什麼我會寫這本書",
    ]

    for part in PARTS:
        lines.extend(
            [
                "",
                f"## {part['number']}　{part['title']}",
                f"> {part['subtitle']}",
            ]
        )
        for chapter in part["chapters"]:
            lines.append(f"- {chapter}")

    lines.extend(
        [
            "",
            "- 後記",
            "",
            "---",
        ]
    )
    return "\n".join(lines)


def build_part_page(part: dict) -> str:
    chapter_lines = "\n".join(f"- {chapter}" for chapter in part["chapters"])
    return "\n".join(
        [
            "---",
            "",
            f"# {part['number']}　{part['title']}",
            "",
            f"> {part['subtitle']}",
            "",
            part["design_note"],
            "",
            "本篇收錄：",
            chapter_lines,
            "",
        ]
    )


def build_manuscript() -> str:
    sections: list[str] = ["# 全文", ""]
    current_part_index: int | None = None

    for name, part_index in ORDERED_FILES:
        if part_index is not None and part_index != current_part_index:
            sections.append(build_part_page(PARTS[part_index]))
            current_part_index = part_index

        sections.append(load_markdown(name))
        sections.append("")

    return "\n".join(sections).strip()


def main() -> None:
    content = "\n\n".join(
        [
            build_cover(),
            build_design_notes(),
            build_toc(),
            build_manuscript(),
        ]
    ).strip() + "\n"

    OUTPUT.write_text(content, encoding="utf-8")
    print(OUTPUT)


if __name__ == "__main__":
    main()
