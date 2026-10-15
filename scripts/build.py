import os, json, re

mappings = [
    ('templates/index.html', 'data/home.json', 'index.html'),
    ('templates/about.html', 'data/about.json', 'about.html'),
    ('templates/service.html', 'data/service.json', 'service.html'),
    ('templates/process.html', 'data/process.json', 'process.html'),
    ('templates/contact.html', 'data/contact.json', 'contact.html'),
    ('templates/gallery.html', 'data/gallery.json', 'gallery.html'),
]

for tmpl_path, json_path, out_path in mappings:
    if not os.path.exists(tmpl_path) or not os.path.exists(json_path):
        continue
    with open(tmpl_path, 'r', encoding='utf-8') as f:
        html = f.read()
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    for key, val in data.items():
        tag = '{{ ' + key + ' }}'
        html = html.replace(tag, str(val))
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Compiled {out_path} with {len(data)} values.")
