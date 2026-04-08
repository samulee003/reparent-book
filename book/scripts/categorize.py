import json, sys, re
from datetime import datetime
sys.stdout.reconfigure(encoding='utf-8')

with open(r'c:\Users\senghangl\WorkBuddy\Claw\fb_posts_fixed.json', 'r', encoding='utf-8') as f:
    posts = json.load(f)

# Category keywords for detailed mapping
categories = {
    'C1_父母焦慮與失控': ['新手爸媽', '焦慮', '失控', '情緒', '生氣', '吼', '忍耐', '壓力', '身心俱疲', '失守', '犧牲', '努力', '耗竭'],
    'C2_ACEs童年創傷': ['ACE', '不良經驗', '童年創傷', '創傷', '毒性壓力', '虐待', '暴力', '忽視'],
    'C3_大腦與神經': ['大腦', '神經', '腦', '皮質醇', '杏仁核', '科學', '研究', '發展'],
    'C4_依附關係': ['依附', '擁抱', '安撫', '嬰兒', '安全感', '分離', '連結', '同在'],
    'C5_乖孩子': ['乖', '順從', '聽話', '叛逆', '壓抑', '期待'],
    'C6_自我批評與羞愧': ['自我批評', '羞愧', '內疚', '罪惡', '不夠好', '自責', '完美'],
    'C7_自我慈悲': ['自我慈悲', '自我關懷', '接納', '原諒', '疼惜', '溫柔'],
    'C8_執行功能與注意力': ['執行功能', '注意力', '專注', 'ADHD', '注意力不足', '大腦CEO', '衝動'],
    'C9_3C螢幕時間': ['3C', '螢幕', '手機', '平板', '滑', '沒收'],
    'C10_手足競爭': ['二寶', '手足', '嫉妒', '大寶', '弟弟', '妹妹'],
    'C11_青少年': ['青少年', '國中', '高中', '叛逆期', '憂鬱', '自傷', '自殺'],
    'C12_祖父母與家庭': ['祖父母', '長輩', '原生家庭', '婆婆', '婆媳', '三代'],
    'C13_情緒教養': ['情緒', '情商', 'EQ', '感覺', '感受', '覺察', '表達'],
    'C14_正向教養技巧': ['教養', '管教', '界線', '規矩', '獎勵', '懲罰', '自然後果', '陪伴'],
    'C15_性別與身體': ['性', '身體', '身材', '性騷', '經期', '月經'],
    'C16_復原力與心理韌性': ['復原力', '韌性', '挫折', '抗壓', '心理', '面對'],
    'C17_閱讀推薦': ['繪本推薦', '好書推薦', '閱讀'],
    'C18_多元與包容': ['多元', '神經多樣', '自閉', '特殊', '差異', 'ASD'],
    'C19_教育反思': ['教育', '學校', '成績', '分數', '升學', '補習', '競爭', 'PISA'],
    'C20_高敏感': ['高敏感', 'HSC', '敏感', '內向', '害羞', 'Introvert'],
    'C21_心理治療現場': ['心理師', '諮商', '治療', '輔導', '會談', '個案', '臨床', '社工', '一線'],
    'C22_反思與重新養自己': ['重新養', '療癒', '修復', '自我', '成長', '覺醒', '覺察'],
}

results = {}
for cat, keywords in categories.items():
    results[cat] = []

for p in posts:
    if isinstance(p, dict):
        ts = p.get('timestamp', 0)
        for item in p.get('data', []):
            if isinstance(item, dict):
                post = item.get('post', '')
                if post and len(post) > 300:
                    for cat, keywords in categories.items():
                        for kw in keywords:
                            if kw in post:
                                dt = datetime.fromtimestamp(ts).strftime('%Y-%m-%d') if ts else 'unknown'
                                # Get first meaningful line as title
                                lines = [l.strip() for l in post.split('\n') if l.strip()]
                                title = lines[0][:100] if lines else '(untitled)'
                                results[cat].append((dt, title, len(post)))
                                break  # Only count once per category

# Write organized material map
with open(r'c:\Users\senghangl\WorkBuddy\Claw\book\99_material\detailed_map.md', 'w', encoding='utf-8') as f:
    f.write('# 詳細素材分類地圖\n\n')
    f.write(f'> 篩選條件：300 字以上貼文\n')
    f.write(f'> 建立日期：2026-04-02\n\n')
    
    for cat in sorted(results.keys()):
        items = sorted(results[cat], key=lambda x: x[2], reverse=True)
        f.write(f'## {cat}（{len(items)} 篇）\n\n')
        for dt, title, length in items[:15]:
            f.write(f'- [{dt}] ({length}字) {title}\n')
        if len(items) > 15:
            f.write(f'\n*…另有 {len(items)-15} 篇*\n')
        f.write('\n')

print('Detailed map written')
