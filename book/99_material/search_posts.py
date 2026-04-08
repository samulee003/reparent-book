#!/usr/bin/env python
# -*- coding: utf-8 -*-
import re

# 搜索关键词
keywords = ['棉花糖', 'IFS', '內在家庭', '虎媽', 'Maté', '真實性', 'attachment', 'authenticity', '消防員']

with open('key_posts_full.txt', 'r', encoding='utf-8') as f:
    content = f.read()
    
# 分割成各个帖子
posts = content.split('============================================================')

results = []
results.append('Total posts: ' + str(len(posts)))
results.append('')

found_posts = []
for i, post in enumerate(posts):
    for kw in keywords:
        if kw in post:
            lines = post.strip().split('\n')
            title = lines[0] if lines else 'Unknown'
            found_posts.append((i, kw, title[:100]))
            break

# 按索引排序
found_posts.sort(key=lambda x: x[0])

for idx, kw, title in found_posts:
    results.append('[' + str(idx) + '] Keyword "' + kw + '" in: ' + title[:80])

# 写入文件
with open('search_results.txt', 'w', encoding='utf-8') as f:
    f.write('\n'.join(results))

print('Results written to search_results.txt')
