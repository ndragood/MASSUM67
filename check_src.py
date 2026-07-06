import re
with open(r'c:\Users\Andra\Documents\3.My Project\MASSUM\index.html', 'r', encoding='utf-8') as f:
    c = f.read()
matches = re.findall(r'<img alt="(.*?) avatar" src="(.*?)"', c)
for m in matches:
    print(m)
