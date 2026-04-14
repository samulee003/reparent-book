from pathlib import Path

d = Path('book/plan-c')
files = ['foreword.md'] + [f'ch{i:02d}.md' for i in range(1, 13)] + ['afterword.md']
total = 0
for f in files:
    p = d / f
    if p.exists():
        c = p.read_text(encoding='utf-8')
        chars = len(c.replace('\n', '').replace(' ', ''))
        total += chars
        print(f'  {f:15s} {chars:6,} chars')

sep = '-' * 30
print(f'  {sep}')
print(f'  TOTAL:          {total:6,} chars (~{total // 500:,} pages)')
