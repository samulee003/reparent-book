import os, sys

base = r'c:\Users\senghangl\WorkBuddy\Claw\book\02_contents'
output = r'c:\Users\senghangl\WorkBuddy\Claw\book\當了父母才開始重新養育自己_初稿.md'

files_order = [
    'foreword.md',
    'ch01.md',
    'ch02.md',
    'ch03.md',
    'ch04.md',
    'ch05.md',
    'ch06.md',
    'ch07.md',
    'ch08.md',
    'ch09.md',
    'ch10.md',
    'ch11.md',
    'ch12.md',
    'afterword.md',
]

parts = []
total_chars = 0

for f in files_order:
    path = os.path.join(base, f)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as fh:
            content = fh.read()
            parts.append(content)
            total_chars += len(content)
            # Count Chinese chars
            cn = sum(1 for c in content if '\u4e00' <= c <= '\u9fff')
            print(f'{f}: {len(content)} chars ({cn} Chinese)')

with open(output, 'w', encoding='utf-8') as fh:
    fh.write('\n\n---\n\n'.join(parts))

print(f'\nTotal: {total_chars} chars')
print(f'Output: {output}')
