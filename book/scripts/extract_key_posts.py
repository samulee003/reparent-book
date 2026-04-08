import json, sys
from datetime import datetime
sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\senghangl\WorkBuddy\Claw\fb_posts_fixed.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

# Key post dates to extract (for chapters 1-2)
target_dates = [
    '2019-06-28',  # 新手爸媽 3072字
    '2025-11-02',  # 已經夠努力了 2022字
    '2019-05-04',  # ACEs 2519字
    '2025-10-14',  # 大腦從未忘記 2707字
    '2019-07-12',  # 越乖失控 1149字
    '2025-10-15',  # 自我批評 2741字 + 自我關懷 2746字
    '2025-11-07',  # 扮演正常 2726字
    '2025-10-28',  # 羞愧感 1587字
    '2025-10-21',  # 同在的力量 2106字
    '2025-11-23_1',  # 大腦CEO 2105字
    '2025-11-23_2',  # 身材焦慮失控 2231字
    '2022-08-12',  # 態度散漫 2104字
    '2025-10-17',  # 3C 2088字
    '2020-11-12',  # 二寶微創傷 1798字
    '2021-12-06',  # 天下無不是 1674字
    '2019-08-05',  # 與長輩立場不同 1666字
    '2020-06-10',  # 復原力 1995字
    '2024-03-13',  # 一線社工 1656字
    '2025-11-25',  # 男孩悄悄受傷 1600字
    '2023-11-23',  # 當情緒被接住 2275字
    '2019-03-29',  # 擁抱安撫 2383字
    '2021-11-12',  # Self Control 2432字
    '2021-10-15',  # 疏遠內心感受的創傷 1756字
    '2018-08-26',  # 新手母親的喜悅與掙扎 1176字
]

all_posts = []
for p in posts:
    if isinstance(p, dict):
        ts = p.get('timestamp', 0)
        for item in p.get('data', []):
            if isinstance(item, dict):
                post = item.get('post', '')
                if post and len(post) > 300:
                    dt = datetime.fromtimestamp(ts).strftime('%Y-%m-%d') if ts else 'unknown'
                    all_posts.append((dt, post, ts))

# Extract posts by target dates
output_parts = []
written_dates = set()

for target in target_dates:
    base_date = target.split('_')[0]
    idx = int(target.split('_')[1]) - 1 if '_' in target else 0
    
    matches = [(dt, post) for dt, post, ts in all_posts if dt == base_date]
    
    if matches:
        if idx < len(matches):
            dt, post = matches[idx]
            key = f'{dt}_{idx}'
            if key not in written_dates:
                written_dates.add(key)
                lines = post.strip().split('\n')
                title = lines[0][:100]
                output_parts.append(f'\n{"="*60}\n')
                output_parts.append(f'[{dt}] ({len(post)}字) {title}\n')
                output_parts.append(f'{"="*60}\n\n')
                output_parts.append(post)
                output_parts.append('\n')

with open(r'c:\Users\senghangl\WorkBuddy\Claw\book\99_material\key_posts_full.txt', 'w', encoding='utf-8') as f:
    f.write('# 核心素材全文\n\n')
    f.writelines(output_parts)

print(f'Extracted {len(written_dates)} key posts')
