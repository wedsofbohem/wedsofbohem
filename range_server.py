#!/usr/bin/env python3
"""
Threaded HTTP server with full HTTP Range (206 Partial Content) support.
Essential for HTML5 video streaming on Safari, iOS, Chrome, and modern browsers.
"""

import os
import sys
import mimetypes
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

class RangeHTTPRequestHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Accept-Ranges", "bytes")
        super().end_headers()

    def do_HEAD(self):
        f = self.send_head()
        if f:
            f.close()

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()

        ctype = self.guess_type(path)
        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(404, "File not found")
            return None

        try:
            fs = os.fstat(f.fileno())
            file_len = fs[6]
        except Exception:
            f.close()
            raise

        range_header = self.headers.get('Range')
        if range_header:
            range_match = range_header.strip()
            if range_match.startswith('bytes='):
                range_str = range_match[6:]
                parts = range_str.split('-')
                start_str = parts[0].strip()
                end_str = parts[1].strip() if len(parts) > 1 else ""

                if start_str and end_str:
                    start = int(start_str)
                    end = int(end_str)
                elif start_str:
                    start = int(start_str)
                    end = file_len - 1
                elif end_str:
                    suffix = int(end_str)
                    start = max(0, file_len - suffix)
                    end = file_len - 1
                else:
                    start = 0
                    end = file_len - 1

                if start >= file_len or end >= file_len or start > end:
                    self.send_response(416, "Requested Range Not Satisfiable")
                    self.send_header("Content-Range", f"bytes */{file_len}")
                    self.send_header("Accept-Ranges", "bytes")
                    self.end_headers()
                    f.close()
                    return None

                length = end - start + 1
                self.send_response(206, "Partial Content")
                self.send_header("Content-Type", ctype)
                self.send_header("Content-Range", f"bytes {start}-{end}/{file_len}")
                self.send_header("Content-Length", str(length))
                self.send_header("Accept-Ranges", "bytes")
                self.send_header("Cache-Control", "public, max-age=3600")
                self.end_headers()

                f.seek(start)
                return _RangeFile(f, length)

        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(file_len))
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "public, max-age=3600")
        self.end_headers()
        return f

class _RangeFile:
    def __init__(self, fp, length):
        self.fp = fp
        self.remaining = length

    def read(self, size=-1):
        if self.remaining <= 0:
            return b""
        if size < 0 or size > self.remaining:
            size = self.remaining
        data = self.fp.read(size)
        self.remaining -= len(data)
        return data

    def close(self):
        return self.fp.close()

def run(port=8081):
    mimetypes.add_type('video/mp4', '.mp4')
    mimetypes.add_type('video/mp4', '.m4v')
    server_address = ('', port)
    httpd = ThreadingHTTPServer(server_address, RangeHTTPRequestHandler)
    print(f"Serving HTTP with Range Support on port {port} (http://localhost:{port}/)...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8081
    run(port)
