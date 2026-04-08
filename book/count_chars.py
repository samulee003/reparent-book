import os, re
d = r'c:\Users\senghangl\WorkBuddy\Claw\book\02_contents'
files = sorted(f for f in os.listdir(d) if f.endswith('.md'))
total = 0
for f in files:
    path = os.path.join(d, f)
    text = open(path, encoding='utf-8').read()
    chars = len(re.findall(r'[\u4e00-\u9fff]', text))
    lines = len(text.splitlines())
    total += chars
    print(f'{f}: {chars} 中文字, {lines} 行')
print(f'\n合計: {total} 中文字')
