import os, re

pages_dir = 'c:\\Users\\user\\Downloads\\gs/pages'

# Mapping of old href patterns to correct ones for pages inside /pages/
# From a page in /pages/, to reach:
# - index.html (home): ../index.html
# - pages/industries.html: ./industries.html or ../pages/industries.html
# - pages/about.html: ./about.html
# etc.

# First, let's see what links exist in sub-pages
for fname in sorted(os.listdir(pages_dir)):
    if not fname.endswith('.html'):
        continue
    fpath = os.path.join(pages_dir, fname)
    content = open(fpath, 'r', encoding='utf-8-sig', errors='replace').read()
    
    # Find all href links
    links = re.findall(r'href="([^"]+)"', content)
    nav_links = [l for l in links if 'pages/' in l or '..html' in l]
    
    print(f'{fname}:')
    for l in nav_links[:10]:
        print(f'  {l}')
    print()