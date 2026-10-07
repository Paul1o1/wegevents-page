#!/usr/bin/env python3
"""
Custom Multi-Threaded HTTP server for WEG Events website.
- Uses ThreadingHTTPServer to prevent request deadlocks/freezes.
- Handles clean extensionless URL routing (/service -> service.html, /about -> about.html).
- Supports CORS headers.
- Supports HTTP Range requests (206 Partial Content) for seamless video/audio streaming.
"""
import http.server
import os
import re
import urllib.parse
import mimetypes

PORT = 8000
ROOT = os.path.dirname(os.path.abspath(__file__))

# Ensure common MIME types are registered
mimetypes.init()
mimetypes.add_type("application/javascript", ".mjs")
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("font/woff2", ".woff2")
mimetypes.add_type("font/woff", ".woff")
mimetypes.add_type("image/svg+xml", ".svg")
mimetypes.add_type("image/webp", ".webp")
mimetypes.add_type("image/jpeg", ".jpg")
mimetypes.add_type("image/png", ".png")
mimetypes.add_type("video/mp4", ".mp4")
mimetypes.add_type("video/webm", ".webm")

# Map of clean URLs -> actual HTML file paths (relative to ROOT)
ROUTES = {
    "/":             "index.html",
    "/about":        "about.html",
    "/service":      "service.html",
    "/gallery":      "gallery.html",
    "/process":      "process.html",
    "/contact":      "contact.html",
    "/blog":         "blog.html",
    "/case-study":   "case-study.html",
    # Service sub-pages
    "/service/day-of-coordination":  "service/day-of-coordination.html",
    "/service/full-planning-design": "service/full-planning-design.html",
    "/service/partial-planning":     "service/partial-planning.html",
    "/service/destination-weddings": "service/destination-weddings.html",
    # Blog sub-pages
    "/blog/your-guide-to-wedding-planning":     "blog/your-guide-to-wedding-planning.html",
    "/blog/designing-a-wedding-your-way":       "blog/designing-a-wedding-your-way.html",
    "/blog/wedding-planning-mistakes-to-avoid": "blog/wedding-planning-mistakes-to-avoid.html",
    "/blog/questions-before-hiring-a-planner":  "blog/questions-before-hiring-a-planner.html",
    "/blog/your-guide-to-wedding-venues":       "blog/your-guide-to-wedding-venues.html",
    "/blog/creating-a-smooth-wedding-timeline": "blog/creating-a-smooth-wedding-timeline.html",
    # Case studies
    "/case-study/clara-james":   "case-study/clara-james.html",
    "/case-study/mei-thomas":    "case-study/mei-thomas.html",
    "/case-study/sofia-luca":    "case-study/sofia-luca.html",
    "/case-study/true-moments":  "case-study/true-moments.html",
    # Legal
    "/legal/privacy-policy":    "legal/privacy-policy.html",
    "/legal/terms-conditions":  "legal/terms-conditions.html",
}

class WEGThreadingHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS and Accept-Ranges
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_HEAD(self):
        self.do_GET()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        clean_path = parsed.path.rstrip("/") or "/"

        # 1. Clean route map check
        if clean_path in ROUTES:
            file_path = os.path.join(ROOT, ROUTES[clean_path])
            if os.path.isfile(file_path):
                self.serve_file(file_path)
                return

        # 2. Check if clean_path + ".html" exists directly
        rel_path = clean_path.lstrip("/")
        direct_html = os.path.join(ROOT, rel_path + ".html")
        if os.path.isfile(direct_html):
            self.serve_file(direct_html)
            return

        # 3. Direct file check with Range request handling
        safe_rel_path = urllib.parse.unquote(clean_path.lstrip("/"))
        file_path = os.path.join(ROOT, safe_rel_path)
        if os.path.isfile(file_path):
            self.serve_file(file_path)
            return

        # 4. Fall through to standard handler
        super().do_GET()

    def serve_file(self, file_path):
        try:
            file_size = os.path.getsize(file_path)
            ext = os.path.splitext(file_path)[1]
            mime_type = mimetypes.guess_type(file_path)[0] or "application/octet-stream"
            if ext == ".html":
                mime_type = "text/html; charset=utf-8"

            range_header = self.headers.get("Range")
            if range_header and range_header.startswith("bytes="):
                # Handle HTTP Range Request (206 Partial Content)
                range_spec = range_header[6:].strip()
                match = re.match(r"^(\d+)-(\d*)$", range_spec)
                if match:
                    start_str, end_str = match.groups()
                    start = int(start_str)
                    end = int(end_str) if end_str else file_size - 1

                    if start >= file_size:
                        self.send_response(416)  # Range Not Satisfiable
                        self.send_header("Content-Range", f"bytes */{file_size}")
                        self.end_headers()
                        return

                    end = min(end, file_size - 1)
                    length = end - start + 1

                    self.send_response(206)
                    self.send_header("Content-Type", mime_type)
                    self.send_header("Content-Range", f"bytes {start}-{end}/{file_size}")
                    self.send_header("Content-Length", str(length))
                    self.send_header("Cache-Control", "no-cache")
                    self.end_headers()

                    with open(file_path, "rb") as f:
                        f.seek(start)
                        remaining = length
                        chunk_size = 64 * 1024
                        while remaining > 0:
                            read_bytes = f.read(min(remaining, chunk_size))
                            if not read_bytes:
                                break
                            self.wfile.write(read_bytes)
                            remaining -= len(read_bytes)
                    return

            # Full file serve (200 OK)
            self.send_response(200)
            self.send_header("Content-Type", mime_type)
            self.send_header("Content-Length", str(file_size))
            self.send_header("Cache-Control", "no-cache")
            self.end_headers()

            with open(file_path, "rb") as f:
                chunk_size = 64 * 1024
                while True:
                    chunk = f.read(chunk_size)
                    if not chunk:
                        break
                    self.wfile.write(chunk)
        except (BrokenPipeError, ConnectionResetError):
            # Client closed connection prematurely (normal during video buffering)
            pass
        except Exception as e:
            try:
                self.send_error(500, str(e))
            except Exception:
                pass

    def log_message(self, format, *args):
        # Suppress log clutter for partial media chunks
        pass


if __name__ == "__main__":
    os.chdir(ROOT)
    server = http.server.ThreadingHTTPServer(("", PORT), WEGThreadingHandler)
    print(f"✅ WEG Events Multi-Threaded Server running at http://localhost:{PORT}")
    print("Routes: /service, /about, /gallery, /process, /contact, /blog, /case-study")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
