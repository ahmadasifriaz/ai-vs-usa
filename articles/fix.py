import glob, re
for f in glob.glob('articles/*.html'):
    with open(f,'r',encoding='utf-8') as file:
        c=file.read()
    # / wale canonical ko .html me badlo
    c=re.sub(r'<link rel="canonical" href="https://ai-vs-usa.pages.dev/articles/(.*?)/" />', r'<link rel="canonical" href="https://ai-vs-usa.pages.dev/articles/\1.html" />', c)
    with open(f,'w',encoding='utf-8') as file:
        file.write(c)
    print(f'fixed {f}')