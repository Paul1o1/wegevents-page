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
    default_pool = [
        "/images/hosts.jpg",
        "/images/table-decor.jpg",
        "/images/ceremony.jpg",
        "/images/guest-book.jpg",
        "/images/DSC_9662_result (1).jpg",
        "/images/_DSC8465_result (1).jpg",
        "/images/SAM07611_result (1).jpg",
        "/images/DSC_9667_result (1).jpg",
        "/images/welcome-sign.jpg"
    ]
    for idx, card in enumerate(cards, 1):
        img = card.get("image", "/images/hosts.jpg")
        cat = card.get("category", "Weddings")
        title = card.get("title", "")
        desc = card.get("description", "")
        btn = card.get("button_text", "View Gallery")
        if btn in ["Read Story", "Inquire For Details"]:
            btn = "View Gallery"
        
        photos = card.get("photos", [])
        if not photos or not isinstance(photos, list):
            photos = [img] + [p for p in default_pool if p != img]
        photos = photos[:9]
        
        photos_attr = json.dumps(photos).replace('"', '&quot;')
        safe_title = title.replace('"', '&quot;')
        safe_cat = cat.replace('"', '&quot;')
        safe_desc = desc.replace('"', '&quot;')
        
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
          <div class="gallery-card-img-wrap" data-action="open-couple-gallery" data-title="{safe_title}" data-category="{safe_cat}" data-desc="{safe_desc}" data-photos="{photos_attr}" role="button" tabindex="0" aria-label="View gallery for {safe_title}">
            <img src="{img}" alt="{title}" class="gallery-card-img" loading="lazy">
            <div class="gallery-card-hover-overlay">
              <span class="gallery-hover-tag">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                View 9 Photos
              </span>
            </div>
          </div>
          <div class="gallery-card-body">
            <p class="gallery-card-cat">{cat}</p>
            <h3 class="gallery-card-title">{title}</h3>
            <p class="gallery-card-desc">{desc}</p>
            <button type="button" class="gallery-card-btn" data-action="open-couple-gallery" data-title="{safe_title}" data-category="{safe_cat}" data-desc="{safe_desc}" data-photos="{photos_attr}">
              {btn}
            </button>
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

def build_blog_cards(posts):
    html_cards = []
    for p in posts:
        slug = p.get("slug", "")
        title = p.get("title", "")
        cat = p.get("category", "Journal")
        img = p.get("image", "/images/welcome-sign.jpg")
        summary = p.get("summary", "")
        
        html_cards.append(f'''        <!-- Blog Post: {title} -->
        <div class="service-card" data-framer-name="Post" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
          <a href="/blog/{slug}" style="display: block; overflow: hidden;">
            <img src="{img}" alt="{title}" style="width: 100%; height: 240px; object-fit: cover; transition: transform 0.4s ease;">
          </a>
          <div style="padding: 2rem; display: flex; flex-direction: column; flex-grow: 1;">
            <p class="sub-heading">{cat}</p>
            <h3 class="heading-sm" style="margin-bottom: 0.75rem;"><a href="/blog/{slug}" style="color: inherit; text-decoration: none;">{title}</a></h3>
            <p class="text-muted" style="font-size: 0.95rem; margin-bottom: 1.25rem; flex-grow: 1;">{summary}</p>
            <div>
              <a href="/blog/{slug}" class="btn btn-outline" style="padding: 0.5rem 1rem; font-size: 0.75rem;">Read Article &rarr;</a>
            </div>
          </div>
        </div>''')
    return "\n\n".join(html_cards)

def format_post_date(date_str):
    if not date_str:
        return ""
    try:
        from datetime import datetime
        dt = datetime.strptime(str(date_str).strip()[:10], "%Y-%m-%d")
        return dt.strftime("%B %d, %Y")
    except Exception:
        return str(date_str)

mappings = [
    ('templates/index.html', 'data/home.json', 'index.html'),
    ('templates/about.html', 'data/about.json', 'about.html'),
    ('templates/service.html', 'data/service.json', 'service.html'),
    ('templates/process.html', 'data/process.json', 'process.html'),
    ('templates/contact.html', 'data/contact.json', 'contact.html'),
    ('templates/gallery.html', 'data/gallery.json', 'gallery.html'),
]

# Load Global Settings (contact info & social links)
settings = {}
if os.path.exists('data/settings.json'):
    with open('data/settings.json', 'r', encoding='utf-8') as f:
        settings = json.load(f)

for tmpl_path, json_path, out_path in mappings:
    if not os.path.exists(tmpl_path) or not os.path.exists(json_path):
        continue
    with open(tmpl_path, 'r', encoding='utf-8') as f:
        html = f.read()
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Merge global settings into page data
    merged_data = dict(settings)
    merged_data.update(data)
    
    # Establish aliases for consistent footer and contact variables
    if 'company_email' in merged_data:
        merged_data['footer_email'] = merged_data['company_email']
    if 'company_phone' in merged_data:
        merged_data['footer_phone'] = merged_data['company_phone']
    if 'company_location' in merged_data:
        merged_data['footer_location'] = merged_data['company_location']
    if 'instagram_url' in merged_data:
        merged_data['footer_instagram_url'] = merged_data['instagram_url']
    if 'tiktok_url' in merged_data:
        merged_data['footer_tiktok_url'] = merged_data['tiktok_url']
    if 'linkedin_url' in merged_data:
        merged_data['footer_linkedin_url'] = merged_data['linkedin_url']
    if 'telegram_url' in merged_data:
        merged_data['footer_telegram_url'] = merged_data['telegram_url']

    # Dynamic lists handling
    if 'faqs' in merged_data and '{{ faq_items }}' in html:
        html = html.replace('{{ faq_items }}', build_faqs(merged_data['faqs']))
    if 'gallery_cards' in merged_data and '{{ gallery_cards_html }}' in html:
        html = html.replace('{{ gallery_cards_html }}', build_gallery_cards(merged_data['gallery_cards']))
    if 'testimonials' in merged_data and '{{ testimonial_slides }}' in html:
        html = html.replace('{{ testimonial_slides }}', build_testimonials(merged_data['testimonials']))
    if 'team_members' in merged_data and '{{ team_cards }}' in html:
        html = html.replace('{{ team_cards }}', build_team(merged_data['team_members']))

    # Scalar tag replacements
    for key, val in merged_data.items():
        if isinstance(val, (str, int, float)):
            tag = '{{ ' + key + ' }}'
            html = html.replace(tag, str(val))

    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"Compiled {out_path}")

def render_markdown(text):
    if not text:
        return ""
    if "<" in text and ">" in text and ("<p>" in text or "<h2>" in text or "<h3>" in text):
        return text  # Already formatted HTML
    
    lines = text.split("\n")
    html_parts = []
    in_list = False
    
    for line in lines:
        stripped = line.strip()
        if not stripped:
            if in_list:
                html_parts.append("</ul>")
                in_list = False
            continue
        
        # Heading 3
        if stripped.startswith("### "):
            if in_list:
                html_parts.append("</ul>")
                in_list = False
            h_text = stripped[4:]
            html_parts.append(f'<h3 class="heading-sm" style="margin-top: 1.75rem; margin-bottom: 0.75rem; color: var(--weg-text-dark);">{h_text}</h3>')
        # Heading 2
        elif stripped.startswith("## "):
            if in_list:
                html_parts.append("</ul>")
                in_list = False
            h_text = stripped[3:]
            html_parts.append(f'<h2 class="heading-md" style="margin-top: 2.25rem; margin-bottom: 1rem; color: var(--weg-text-dark);">{h_text}</h2>')
        # Heading 1
        elif stripped.startswith("# "):
            if in_list:
                html_parts.append("</ul>")
                in_list = False
            h_text = stripped[2:]
            html_parts.append(f'<h2 class="heading-md" style="margin-top: 2.25rem; margin-bottom: 1rem; color: var(--weg-text-dark);">{h_text}</h2>')
        # List items
        elif stripped.startswith("- ") or stripped.startswith("* "):
            if not in_list:
                html_parts.append('<ul style="margin-bottom: 1.5rem; padding-left: 1.5rem; line-height: 1.8;">')
                in_list = True
            li_text = stripped[2:]
            li_text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', li_text)
            html_parts.append(f'<li style="margin-bottom: 0.5rem;">{li_text}</li>')
        else:
            if in_list:
                html_parts.append("</ul>")
                in_list = False
            p_text = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', stripped)
            p_text = re.sub(r'\*(.*?)\*', r'<em>\1</em>', p_text)
            html_parts.append(f'<p style="margin-bottom: 1.5rem; line-height: 1.8;">{p_text}</p>')
            
    if in_list:
        html_parts.append("</ul>")
        
    return "\n".join(html_parts)

# ============================================================
# BLOG COMPILATION (Posts Collection + Main Listing)
# ============================================================
import glob, subprocess

blog_posts = []
blog_files = glob.glob('content/blog/*.json')
for fpath in blog_files:
    try:
        with open(fpath, 'r', encoding='utf-8') as f:
            post_data = json.load(f)
            if not post_data.get('slug'):
                post_data['slug'] = os.path.splitext(os.path.basename(fpath))[0]
            
            # Timestamp tie-breakers when multiple posts have the same date
            git_time = 0
            try:
                out = subprocess.check_output(['git', 'log', '-1', '--format=%ct', fpath], stderr=subprocess.DEVNULL).decode().strip()
                if out.isdigit():
                    git_time = int(out)
            except Exception:
                pass
            post_data['_git_time'] = git_time
            post_data['_mtime'] = os.path.getmtime(fpath) if os.path.exists(fpath) else 0

            blog_posts.append(post_data)
    except Exception as e:
        print(f"⚠️ Error reading blog post {fpath}: {e}")

# Sort newest first: primary by date (YYYY-MM-DD), secondary by commit timestamp, tertiary by file mtime
blog_posts.sort(key=lambda p: (str(p.get('date', '')), p.get('_git_time', 0), p.get('_mtime', 0)), reverse=True)

# 1. Compile Main Blog Page (blog.html and blog/index.html)
if os.path.exists('templates/blog.html'):
    with open('templates/blog.html', 'r', encoding='utf-8') as f:
        blog_html = f.read()

    blog_page_data = {}
    if os.path.exists('data/blog_page.json'):
        with open('data/blog_page.json', 'r', encoding='utf-8') as f:
            blog_page_data = json.load(f)

    blog_merged = dict(settings)
    blog_merged.update(blog_page_data)

    # Inject dynamic blog cards
    blog_cards_html = build_blog_cards(blog_posts)
    blog_html = blog_html.replace('{{ blog_cards_html }}', blog_cards_html)

    # Scalar tag replacements
    for key, val in blog_merged.items():
        if isinstance(val, (str, int, float)):
            tag = '{{ ' + key + ' }}'
            blog_html = blog_html.replace(tag, str(val))

    with open('blog.html', 'w', encoding='utf-8') as f:
        f.write(blog_html)
    os.makedirs('blog', exist_ok=True)
    with open('blog/index.html', 'w', encoding='utf-8') as f:
        f.write(blog_html)
    print(f"Compiled blog.html and blog/index.html with {len(blog_posts)} articles")

# 2. Compile Individual Blog Post Pages (blog/<slug>.html)
if os.path.exists('templates/blog-post.html'):
    with open('templates/blog-post.html', 'r', encoding='utf-8') as f:
        post_template = f.read()

    for post in blog_posts:
        slug = post.get('slug', '').strip()
        if not slug:
            continue

        post_data = dict(settings)
        post_data.update(post)
        post_data['formatted_date'] = format_post_date(post.get('date', ''))

        # Prepare content: render markdown or preserve rich HTML
        body_content = post.get('content', '')
        post_data['content'] = render_markdown(body_content)

        out_html = post_template
        for key, val in post_data.items():
            if isinstance(val, (str, int, float)):
                tag = '{{ ' + key + ' }}'
                out_html = out_html.replace(tag, str(val))

        post_out_path = f"blog/{slug}.html"
        with open(post_out_path, 'w', encoding='utf-8') as f:
            f.write(out_html)
        print(f"Compiled article {post_out_path}")

print("All pages compiled successfully!")
