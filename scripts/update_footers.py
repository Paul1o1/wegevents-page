import re

footer_connect_replacement = """        <div class="footer-col">
          <h4>Connect</h4>
          <ul>
            <li><a href="mailto:{{ company_email }}">{{ company_email }}</a></li>
            <li><a href="tel:{{ company_phone_tel }}">{{ company_phone }}</a></li>
          </ul>
          <div class="social-links" style="margin-top: 1.25rem;">
            <a href="{{ instagram_url }}" class="social-link" target="_blank" rel="noopener" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="{{ tiktok_url }}" class="social-link" target="_blank" rel="noopener" aria-label="TikTok">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.89 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3 15.67 6.34 6.34 0 0 0 9.34 22a6.34 6.34 0 0 0 6.34-6.33V9.17a8.16 8.16 0 0 0 4.91 1.62v-3.5a4.85 4.85 0 0 1-1-.6z"/></svg>
            </a>
            <a href="{{ linkedin_url }}" class="social-link" target="_blank" rel="noopener" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 1 0 0-3.3 1.65 1.65 0 0 0 0 3.3m1.4 9.74V9.97H5.06v8.53h2.8z"/></svg>
            </a>
            <a href="{{ telegram_url }}" class="social-link" target="_blank" rel="noopener" aria-label="Telegram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/></svg>
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>{{ footer_copyright }}</p>"""

files = [
    "templates/about.html",
    "templates/service.html",
    "templates/process.html",
    "templates/gallery.html",
    "templates/contact.html"
]

pattern = re.compile(
    r'<div class="footer-col">\s*<h4>Connect</h4>.*?<div class="footer-bottom">\s*<p>[^<]*</p>',
    re.DOTALL
)

for path in files:
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    new_content, n = pattern.subn(footer_connect_replacement, content)
    if n > 0:
        with open(path, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Updated footer in {path}")
    else:
        print(f"Pattern not found in {path}")
