"""
Extract key FB posts per chapter for book expansion.
Outputs one file per chapter with relevant full posts.
"""
import json, sys, os
from datetime import datetime

sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\senghangl\WorkBuddy\Claw\fb_posts_fixed.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

def extract_posts(posts, keywords, min_chars=800, max_per_keyword=3):
    """Extract posts matching keywords, return list of {date, title, content, chars}"""
    results = []
    seen_timestamps = set()
    
    for p in posts:
        if not isinstance(p, dict):
            continue
        ts = p.get('timestamp', 0)
        for item in p.get('data', []):
            if not isinstance(item, dict):
                continue
            post = item.get('post', '')
            if not post or len(post) < min_chars:
                continue
            if ts in seen_timestamps:
                continue
            
            post_lower = post.lower()
            matched = False
            for kw in keywords:
                if kw.lower() in post_lower:
                    matched = True
                    break
            
            if matched:
                seen_timestamps.add(ts)
                dt = datetime.fromtimestamp(ts).strftime('%Y-%m-%d') if ts else 'unknown'
                # Get first meaningful line as title
                lines = [l.strip() for l in post.strip().split('\n') if l.strip()]
                title = lines[0][:100] if lines else 'Untitled'
                results.append({
                    'date': dt,
                    'title': title,
                    'content': post.strip(),
                    'chars': len(post),
                    'timestamp': ts
                })
    
    # Deduplicate by timestamp, sort by chars desc
    seen = set()
    unique = []
    for r in sorted(results, key=lambda x: x['chars'], reverse=True):
        if r['timestamp'] not in seen:
            seen.add(r['timestamp'])
            unique.append(r)
    
    return unique[:15]  # Max 15 per chapter

# Chapter-to-keyword mapping
chapters = {
    'ch01_新手父母焦慮': [
        '新手爸媽', '新手父母', '成為父母', '自我失守', '自我重組',
        '7-11媽媽', '代養者', '睡眠', 'Time Out', '不夠好',
        '產後憂鬱', '孕期憂鬱', '心力交瘁', '夠努力了'
    ],
    'ch02_ACEs童年創傷': [
        '童年創傷', 'ACEs', '大腦從未忘記', '神經可塑性',
        '創傷', '布加勒斯特', '孤兒院', '經驗預期',
        '剝奪型', '威脅型', '不可預測', '大腦年齡',
        '愛與傷', '印記', '被觸發', '舊傷'
    ],
    'ch03_乖孩子的代價': [
        '乖孩子', '乖', '不吵不鬧', '安靜的孩子',
        '童年情感忽視', 'CEN', '情感忽視',
        '聽話', '叛逆', '不服從', '越乖越失控',
        '早熟', '懂事', '壓抑情緒'
    ],
    'ch04_自我批評': [
        '自我批評', '內在批評', '罵自己', '錄音',
        '不夠好', '完美標準', '全有全無',
        '放大錯誤', '自我懲罰', '好朋友標準',
        '自我關懷', '自我批評轉為內在力量'
    ],
    'ch05_羞愧感': [
        '羞愧', '罪惡感', 'shame', 'guilt',
        '扮演正常', '耗竭', '面具', '完美媽媽',
        '糟糕的人', '糟糕的媽媽', '不配',
        '身分攻擊', '我是壞'
    ],
    'ch06_自我慈悲': [
        '自我慈悲', 'self-compassion', '同在',
        '情緒被接住', '溫柔對待自己',
        '手放胸口', '正念', '自我善待',
        '共同人性', '心理治療最關鍵'
    ],
    'ch07_執行功能': [
        '執行功能', '大腦CEO', '前額葉', '態度散漫',
        '心智功能', '拖延', '專注', 'ADHD',
        '注意力', '計畫', '工作記憶',
        '神經多樣性', '高敏感'
    ],
    'ch08_3C螢幕時間': [
        '滑手機', '沒收', '螢幕', '手機', '平板',
        '3C', '看太久', '遊戲', '社群媒體',
        '大腦發展遲緩', '連結感', '自主感'
    ],
    'ch09_手足競爭': [
        '手足', '二寶', '大寶', '弟弟', '妹妹',
        '微創傷', '取代', '愛不會被分完',
        '男孩受傷', '悄悄受傷', '男孩不敢說',
        '哥哥姊姊', '懂事', '黏媽媽'
    ],
    'ch10_長輩教養衝突': [
        '天下無不是', '長輩', '為你好', '對你好',
        '教養衝突', '婆媳', '翁婿', '爺爺奶奶',
        '政治立場', '立場不同', '翅膀硬了',
        '白眼狼', '不孝', '管教'
    ],
    'ch11_復原力': [
        '復原力', '挫折', '韌性', '堅強',
        '情緒詞彙', '掌控感', '失敗',
        '跌倒', '爬起來', '獨自扛',
        '正向教養', '星漢燦爛'
    ],
    'ch12_重新養自己': [
        '重新養自己', '覺察', '鏡子', '育兒是一面',
        '一線社工', '零點幾秒', '不帶傷痕',
        '被充電', '道歉', '同路人',
        '不知道', '允許', '夠努力'
    ],
}

output_dir = r'c:\Users\senghangl\WorkBuddy\Claw\book\99_material\chapter_posts'
os.makedirs(output_dir, exist_ok=True)

summary = []
for ch_name, keywords in chapters.items():
    matches = extract_posts(posts, keywords, min_chars=600)
    
    filepath = os.path.join(output_dir, f'{ch_name}.txt')
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(f'# {ch_name} - 可用素材 ({len(matches)} 篇)\n\n')
        for i, m in enumerate(matches):
            f.write(f'---\n## 素材 {i+1}: [{m["date"]}] ({m["chars"]}字)\n')
            f.write(f'**標題**: {m["title"]}\n\n')
            f.write(m['content'])
            f.write('\n\n')
    
    total_chars = sum(m['chars'] for m in matches)
    summary.append(f'{ch_name}: {len(matches)} 篇, 總計 {total_chars:,} 字')
    print(f'{ch_name}: {len(matches)} 篇 ({total_chars:,} 字)')

print(f'\nDone! Files saved to {output_dir}')
print(f'\nSummary:')
for s in summary:
    print(f'  {s}')
