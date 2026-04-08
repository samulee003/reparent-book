import os

content = open(r'c:\Users\senghangl\WorkBuddy\Claw\book\02_contents\ch10_v2.md', 'r', encoding='utf-8').read()

# Copy v2 to ch10
f = r'c:\Users\senghangl\WorkBuddy\Claw\book\02_contents\ch10.md'
with open(f, 'w', encoding='utf-8') as fh:
    fh.write(content)

cn = sum(1 for c in content if '\u4e00' <= c <= '\u9fff')
print(f'ch10.md written: {len(content)} chars, {cn} Chinese')

# Update merge script to use ch10
base = r'c:\Users\senghangl\WorkBuddy\Claw\book\02_contents'
files_order = [
    ('foreword.md', '\u524d\u8a00'),
    ('ch01.md', '\u7b2c\u4e00\u7ae0'),
    ('ch02.md', '\u7b2c\u4e8c\u7ae0'),
    ('ch03.md', '\u7b2c\u4e09\u7ae0'),
    ('ch04.md', '\u7b2c\u56db\u7ae0'),
    ('ch05.md', '\u7b2c\u4e94\u7ae0'),
    ('ch06.md', '\u7b2c\u516d\u7ae0'),
    ('ch07.md', '\u7b2c\u4e03\u7ae0'),
    ('ch08.md', '\u7b2c\u516b\u7ae0'),
    ('ch09.md', '\u7b2c\u4e5d\u7ae0'),
    ('ch10.md', '\u7b2c\u5341\u7ae0'),
    ('ch11.md', '\u7b2c\u5341\u4e00\u7ae0'),
    ('ch12.md', '\u7b2c\u5341\u4e8c\u7ae0'),
    ('afterword.md', '\u5f8c\u8a18'),
]

merged = []
total_chinese = 0
total_all = 0
stats = []

for filename, title in files_order:
    filepath = os.path.join(base, filename)
    with open(filepath, 'r', encoding='utf-8') as fh:
        c = fh.read()
    chinese = sum(1 for x in c if '\u4e00' <= x <= '\u9fff')
    total_chinese += chinese
    total_all += len(c)
    stats.append((title, len(c), chinese))
    merged.append('\n\n' + c)

out = os.path.join(os.path.dirname(base), '\u7576\u4e86\u7236\u6bcd\u624d\u958b\u59cb\u91cd\u65b0\u990a\u80b2\u81ea\u5df1_\u4fee\u8a02\u7248.md')
with open(out, 'w', encoding='utf-8') as fh:
    fh.write(''.join(merged))

print('\n=== Final Stats ===')
for title, total, chinese in stats:
    print(f'{title}: {total:,} / {chinese:,} CN')
print(f'\nTOTAL: {total_all:,} / {total_chinese:,} CN')
print(f'\nSaved: {out}')
