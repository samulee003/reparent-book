import json, sys, re
from datetime import datetime
sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\senghangl\WorkBuddy\Claw\fb_posts_fixed.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

# Extract all long posts (>500 chars) with their titles
results = []
for p in posts:
    if isinstance(p, dict):
        ts = p.get('timestamp', 0)
        for item in p.get('data', []):
            if isinstance(item, dict):
                post = item.get('post', '')
                if post and len(post) > 500:
                    lines = post.strip().split('\n')
                    title = lines[0][:80].strip()
                    title = re.sub(r'[#\u263a-\U0001f9ff\s]+', ' ', title).strip()[:80]
                    dt = datetime.fromtimestamp(ts).strftime('%Y-%m-%d') if ts else 'unknown'
                    results.append((dt, title, len(post), ts))

results.sort(key=lambda x: x[2], reverse=True)

with open(r'c:\Users\senghangl\WorkBuddy\Claw\book\99_material\all_long_posts.txt', 'w', encoding='utf-8') as f:
    for i, (dt, title, length, ts) in enumerate(results):
        f.write(f'{i+1}. [{dt}] ({length} chars) {title}\n')
    f.write(f'\nTotal: {len(results)} posts with >500 chars\n')

print(f'Written {len(results)} posts')
