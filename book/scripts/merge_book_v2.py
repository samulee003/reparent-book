import os, sys

sys.stdout.reconfigure(encoding='utf-8')

base = r'c:\Users\senghangl\WorkBuddy\Claw\book\02_contents'

# Order of chapters
files = [
    ('foreword.md', '前言'),
    ('ch01.md', '第一章'),
    ('ch02.md', '第二章'),
    ('ch03.md', '第三章'),
    ('ch04.md', '第四章'),
    ('ch05.md', '第五章'),
    ('ch06.md', '第六章'),
    ('ch07.md', '第七章'),
    ('ch08.md', '第八章'),
    ('ch09.md', '第九章'),
    ('ch10.md', '第十章'),
    ('ch11.md', '第十一章'),
    ('ch12.md', '第十二章'),
    ('afterword.md', '後記'),
]

merged = []
total_chinese = 0
total_all = 0
stats = []

for filename, title in files:
    filepath = os.path.join(base, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    chinese = sum(1 for c in content if '\u4e00' <= c <= '\u9fff')
    total = len(content)
    total_chinese += chinese
    total_all += total
    stats.append((title, total, chinese))
    merged.append(f'\n\n{content}')

# Write merged file
merged_path = os.path.join(os.path.dirname(base), '當了父母才開始重新養育自己_修訂版.md')
with open(merged_path, 'w', encoding='utf-8') as f:
    f.write(''.join(merged))

# Print stats
print(f'=== 全書修訂版字數統計 ===')
print(f'')
for title, total, chinese in stats:
    print(f'{title}: {total:,} 總字元 / {chinese:,} 中文字')
print(f'')
print(f'總計: {total_all:,} 總字元 / {total_chinese:,} 中文字')
print(f'')
print(f'合併版已寫入: {merged_path}')
