import os, json, re

def build_faqs(faq_list):
    html_items = []
    for idx, item in enumerate(faq_list):
        active_cls = " active" if idx == 0 else ""
        expanded = "true" if idx == 0 else "false"
        q = item.get("question", "")
        a = item.get("answer", "")
        html_items.append(f'''        <!-- FAQ {idx + 1} -->
        <div class="faq-item{active_cls}">
          <button class="faq-question" type="button" aria-expanded="{expanded}">
            <span>{q}</span>
            <span class="icon">+</span>
          </button>
          <div class="faq-answer">
            <p>{a}</p>
          </div>
        </div>''')
    return "\n\n".join(html_items)

def build_gallery_cards(cards):
    html_cards = []
    for idx, card in enumerate(cards, 1):
        img = card.get("image", "/images/hosts.jpg")
        cat = card.get("category", "Weddings")
        title = card.get("title", "")
        desc = card.get("description", "")
        link = card.get("link", "contact.html")
        btn = card.get("button_text", "Inquire For Details")
        
        cat_lower = cat.lower()
        if "mels" in cat_lower:
            data_cat = "mels"
        elif "destination" in cat_lower:
            data_cat = "destination weddings"
        elif "corporate" in cat_lower or "gala" in cat_lower:
            data_cat = "corporate"
        else:
            data_cat = "weddings"
            
        html_cards.append(f'''        <!-- Card {idx}: {title} -->
        <article class="gallery-story-card" data-category="{data_cat}">
          <div class="gallery-card-img-wrap">
            <img src="{img}" alt="{title}" class="gallery-card-img" loading="lazy">
          </div>
          <div class="gallery-card-body">
            <p class="gallery-card-cat">{cat}</p>
            <h3 class="gallery-card-title">{title}</h3>
            <p class="gallery-card-desc">{desc}</p>
            <a href="{link}" class="gallery-card-btn">{btn}</a>
          </div>
        </article>''')
    return "\n\n".join(html_cards)

def build_testimonials(items):
    slides = []
    for idx, item in enumerate(items):
        active_cls = " active" if idx == 0 else ""
        img = item.get("image", "/images/hosts.jpg")
        quote = item.get("quote", "")
        author = item.get("author", "")
        slides.append(f'''      <!-- Testimonial {idx + 1} -->
      <div class="testimonial-hero-slide{active_cls}">
        <img src="{img}" alt="Testimonial background" class="testimonial-hero-bg">
        <div class="testimonial-hero-overlay"></div>
        <div class="testimonial-hero-content">
          <img src="/images/lR0dc3W8oIg4D9UWD3fIwe639h0.svg" alt="Quote" class="testimonial-hero-quote-icon" aria-hidden="true">
          <p class="testimonial-hero-quote">"{quote}"</p>
          <span class="testimonial-hero-author">{author}</span>
        </div>
      </div>''')
    return "\n".join(slides)

def build_team(members):
    cards = []
    for idx, m in enumerate(members, 1):
        name = m.get("name", "")
        role = m.get("role", "")
        img = m.get("image", "/images/hosts.jpg")
        cards.append(f'''        <!-- Team Member {idx} -->
        <div class="team-card" data-framer-name="Card">
          <img src="{img}" alt="{name}" class="team-img">
          <div class="team-info">
            <h3 class="team-name">{name}</h3>
            <p class="team-role">{role}</p>
          </div>
        </div>''')
    return "\n".join(cards)

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

    # Dynamic lists handling
    if 'faqs' in data and '{{ faq_items }}' in html:
        html = html.replace('{{ faq_items }}', build_faqs(data['faqs']))
    if 'gallery_cards' in data and '{{ gallery_cards_html }}' in html:
        html = html.replace('{{ gallery_cards_html }}', build_gallery_cards(data['gallery_cards']))
    if 'testimonials' in data and '{{ testimonial_slides }}' in html:
        html = html.replace('{{ testimonial_slides }}', build_testimonials(data['testimonials']))
    if 'team_members' in data and '{{ team_cards }}' in html:
        html = html.replace('{{ team_cards }}', build_team(data['team_members']))

    # Scalar tag replacements
    for key, val in data.items():
        if isinstance(val, (str, int, float)):
            tag = '{{ ' + key + ' }}'
            html = html.replace(tag, str(val))

    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Compiled {out_path}")

print("All pages compiled successfully!")
