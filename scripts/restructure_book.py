"""
Complete editorial restructure of manuscript.
Executes all structural cuts per editorial review.
"""
import os, sys

def read_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()

def write_file(path, content):
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)

def report(name, orig, new):
    cut = orig - new
    pct = cut * 100 // orig if orig else 0
    print(f'  {name}: {orig:,} -> {new:,} chars (-{cut:,}, {pct}%)')

errors = []

# ═══════════════════════════════════════════
# Chapter 7 — biggest restructure
# ═══════════════════════════════════════════
print('── Ch07: delete 7.7-7.11, rename 7.12→7.7, fence metaphor, trim summary')
p = 'book/plan-c/ch07.md'
c = read_file(p)
orig = len(c)

try:
    # 1) Delete sections 7.7-7.11, rename 7.12 → 7.7
    s = c.index('## 7.7 常見場景與應對')
    e = c.index('## 7.12 打破循環')
    c = c[:s] + '## 7.7 打破循環' + c[e + len('## 7.12 打破循環'):]

    # 2) Insert fence metaphor into 7.5
    old_75 = '界線真正困難的，不是怎麼講，而是你講了之後，能不能承受對方的不高興。\n\n這是成人化的功課。'
    new_75 = (
        '有一位個案教會我一個比喻。她說以前覺得跟長輩溝通教養問題，就像在築一道牆'
        '——要嘛接受，要嘛被拒絕。但這種「全有或全無」的方式，每次都讓關係陷入僵局。'
        '後來她學會設立「柵欄」——有些事情她堅持（比如不體罰），有些事情她可以彈性'
        '（比如零食的規定）。長輩覺得自己還是有影響力，她也守住了核心底線。'
        '\n\n界線不是牆，是柵欄。有縫隙，風可以吹過去，但牛不會闖進來。'
        '\n\n而界線真正困難的，不是怎麼講，而是你講了之後，能不能承受對方的不高興。'
        '這是成人化的功課。'
    )
    assert old_75 in c, 'Cannot find 7.5 closing text'
    c = c.replace(old_75, new_75, 1)

    # 3) Trim summary
    c = c.replace(
        '情緒勒索披著倫理和親情的外衣出現，讓你很難拒絕。看懂它，是界線長出來的前提。'
        '界線不是牆，是柵欄。有縫隙，風可以吹過去，但牛不會闖進來。',
        '情緒勒索披著倫理和親情的外衣出現，看懂它，是界線長出來的前提。'
        '界線不是牆，是柵欄——有些事堅持，有些事彈性。',
        1
    )
    c = c.replace(
        '真正成熟的位置是能自己判斷。打破循環不需要跟父母決裂，'
        '只需要你願意用一種不一樣的方式對待你的孩子。'
        '這整個過程，其實就是在走那條路：先看見舊傷從哪裡來，把它命名，'
        '然後安頓住自己，才有空間開始重寫。',
        '打破循環不需要跟父母決裂，'
        '只需要你願意用一種不一樣的方式對待你的孩子。',
        1
    )

    assert '## 7.7 打破循環' in c
    assert '## 7.8' not in c
    assert '## 7.12' not in c
    write_file(p, c)
    report('ch07.md', orig, len(c))
    print('  ✓ verified')
except Exception as ex:
    errors.append(f'ch07: {ex}')
    print(f'  ✗ ERROR: {ex}')

# ═══════════════════════════════════════════
# Chapter 10 — fix numbering
# ═══════════════════════════════════════════
print('── Ch10: rename 10.8 → 10.6')
p = 'book/plan-c/ch10.md'
c = read_file(p)
orig = len(c)
try:
    c = c.replace('## 10.8 ADHD', '## 10.6 ADHD', 1)
    assert '## 10.6 ADHD' in c
    write_file(p, c)
    report('ch10.md', orig, len(c))
    print('  ✓ verified')
except Exception as ex:
    errors.append(f'ch10: {ex}')
    print(f'  ✗ ERROR: {ex}')

# ═══════════════════════════════════════════
# Chapter 4 — shorten 4.8 and 4.9
# ═══════════════════════════════════════════
print('── Ch04: shorten 4.8 (sister story) and 4.9 (drill team)')
p = 'book/plan-c/ch04.md'
c = read_file(p)
orig = len(c)

NEW_48 = """## 4.8 好的經驗，也會刻進大腦

讀到這裡，如果你覺得沉重，請讓我補上另一半的真相。

創傷研究不只告訴我們什麼是壞的，它也告訴我們：好的經驗同樣會刻進大腦裡，而且它的修復力，往往比創傷更強大。

我自己的家庭就是例子。我出生在一個有兩個女兒的家庭。成長過程中，父母從沒因為我們的性別輕慢對待我們。姊姊申請到常春藤名校時，媽媽向來不願借錢，卻為了女兒回娘家開口。外公一句話回絕：「不借！女孩子都要嫁人了，讀這麼多書幹什麼？」

這句話像一把刀。但它沒有影響姊姊的決心。二十六歲的她扛了近五百萬學貸出國，畢業後一年多還清債務，甚至在父親罹癌時扛下醫療支出。從沒聽她抱怨。

她之所以能站穩，不是因為刀槍不入，而是因為父母從小給了她一個信念：「在父母眼中，不論性別，你就是那個最值得被珍愛的存在。」那個信念，成了她一生最堅固的防線。

正面童年經驗的研究也證實了這一點：有人願意傾聽、有人真心關心你、覺得自己被安全地愛著——這些看似微小的時刻，都在幫大腦建立安全的神經迴路。如果你小時候不曾被這樣愛過，沒關係。從今天開始，你可以做那個打破循環的人。而在給的同時，你也在養那個曾經渴望被這樣對待的自己。"""

NEW_49 = """## 4.9 那個曾經拼命的自己

在結束這一章之前，我想帶你認識另一種「內在小孩」——不是來自傷害，而是來自高度肯定。

我高中參加儀隊，「榮譽、紀律、責任」六個字刻進骨子裡。那段經驗給了我極大的自信和歸屬感，但它也埋下了一顆種子：「我不可以失敗。我不能拖累別人。我要做到最好。」

那顆種子在育兒的過程中發芽了。孩子不聽話，我的內在小孩跳出來：「妳怎麼可以連自己的孩子都管不好？」家裡很亂，她又來了：「以前儀隊的鞋子都要排成一條線，現在連地板都拖不乾淨？」

認出這個部分之後，我開始理解：原來我的自我批評，有一部分來自那個曾被高度肯定、也被高標準要求的女孩。她不是壞的部分，她只是需要被更新——從「如果不完美就不值得被愛」更新成「即使不完美，也值得被愛」。

你的內在小孩呢？哪一段成長經驗塑造了你現在對自己的要求？"""

try:
    # Shorten 4.8
    s48 = c.index('## 4.8 一個不一樣的故事：當愛贏了成見')
    e48 = c.index('## 4.9')
    # Find the --- separator before 4.9
    sep48 = c.rindex('---', s48, e48)
    c = c[:s48] + NEW_48 + '\n\n---\n\n' + c[e48:]

    # Shorten 4.9
    s49 = c.index('## 4.9 那個曾經拼命的自己')
    e49_marker = c.index('## 本章小結', s49)
    sep49 = c.rindex('---', s49, e49_marker)
    c = c[:s49] + NEW_49 + '\n\n' + c[sep49:]

    write_file(p, c)
    report('ch04.md', orig, len(c))
    print('  ✓ done')
except Exception as ex:
    errors.append(f'ch04: {ex}')
    print(f'  ✗ ERROR: {ex}')

# ═══════════════════════════════════════════
# Chapter 11 — merge 11.8-11.11
# ═══════════════════════════════════════════
print('── Ch11: merge 11.8-11.11 into one section')
p = 'book/plan-c/ch11.md'
c = read_file(p)
orig = len(c)

NEW_118 = """## 11.8 當衝突升級：三個原則與一個提醒

理論都懂，但現實常常是：孩子哭鬧、你提高音量、最後變成沒收與對吼。這時最有效的，不是更大聲，而是先回到三個原則：

**一、先降溫，再談規則。** 孩子在情緒高點時，很難合作。先穩住情緒，再討論約定。

**二、用預告與選擇，取代突襲。** 先提醒「還有十分鐘」，時間到時給兩個清楚選項：「你自己關，還是我幫你關？」

**三、把衝突當成問題解決，不是人格審判。** 像半夜偷滑手機這種情況，先談睡眠與壓力，再共同設計可執行方案（例如睡前統一充電區、改用傳統鬧鐘）。

最後一個提醒：螢幕的真正風險不是時間長短，而是「取代了什麼」。如果螢幕吃掉的是睡眠、運動、面對面的互動，那就是問題。藍光會抑制褪黑激素，睡眠不足又進一步削弱執行功能，形成惡性循環。而在所有螢幕活動中，遊戲與情緒困擾的關聯最強——如果孩子幾乎只玩遊戲、不願意做其他事，值得留意他在遊戲裡找到了什麼現實世界沒給他的東西。

如果你想把規則談出效果，找一個雙方都不在氣頭上的時間，和孩子坐下來談：他最常用螢幕做什麼、自己覺得什麼範圍合理、哪些時段不適合使用、時間到了希望怎麼被提醒。規則之所以失效，常常不是不夠嚴，而是孩子從來沒有真正參與過。"""

try:
    s = c.index('## 11.8 當螢幕衝突升級時怎麼辦')
    # Find the transition paragraph that starts the chapter closing
    closing = c.index('說到底，螢幕衝突真正考驗的', s)
    sep = c.rindex('---', s, closing)
    c = c[:s] + NEW_118 + '\n\n' + c[sep:]

    assert '## 11.9' not in c
    assert '## 11.10' not in c
    assert '## 11.11' not in c
    write_file(p, c)
    report('ch11.md', orig, len(c))
    print('  ✓ verified')
except Exception as ex:
    errors.append(f'ch11: {ex}')
    print(f'  ✗ ERROR: {ex}')

# ═══════════════════════════════════════════
# Chapter 12 — condense 12.5
# ═══════════════════════════════════════════
print('── Ch12: condense 12.5 timeline')
p = 'book/plan-c/ch12.md'
c = read_file(p)
orig = len(c)

NEW_125 = """## 12.5 準備大寶迎接二寶

如果你還在懷孕期間，有幾個原則值得記住：

越早告訴大寶越好。孩子對大人情緒的敏感度遠超過我們想像——不確定性，比事實更讓人焦慮。用他聽得懂的語言說就好：「媽媽肚子裡有一個小寶寶在長大，等他夠大了就會來跟我們一起住。」

讓大寶成為參與者，而不是局外人。帶他看超音波照片、一起挑小衣服、準備一份「哥哥姊姊禮物」——告訴他這是弟弟妹妹想送給他的。

生活調整要在二寶來之前就做好。如果大寶要開始練習獨立入睡或讓爸爸分擔更多日常照顧，現在就開始。否則大寶會覺得「都是因為弟弟，我的一切才被改變」。

二寶回家後，最關鍵的事只有一個：每天保留一段只屬於大寶的時間。即使只是睡前十分鐘的故事時間。那些微小的「我專屬的時刻」，是大寶在風暴中最需要的定錨點。不時對孩子說：「我想抱抱妳，不是因為妳需要我，是因為媽媽好需要妳。」被愛得好、安全感十足的孩子，才有能力學習愛弟妹。"""

try:
    s = c.index('## 12.5 準備大寶迎接二寶：一條時間線')
    next_sec = c.index('## 12.6', s)
    sep = c.rindex('---', s, next_sec)
    c = c[:s] + NEW_125 + '\n\n' + c[sep:]

    write_file(p, c)
    report('ch12.md', orig, len(c))
    print('  ✓ done')
except Exception as ex:
    errors.append(f'ch12: {ex}')
    print(f'  ✗ ERROR: {ex}')

# ═══════════════════════════════════════════
# Summary
# ═══════════════════════════════════════════
print()
if errors:
    print(f'⚠ {len(errors)} error(s):')
    for e in errors:
        print(f'  - {e}')
    sys.exit(1)
else:
    print('✅ All chapter edits complete.')
