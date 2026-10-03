#!/usr/bin/env python3
"""
Simple HTTP Server for Digital Climate Change Monitoring Project
Run with: python server.py
"""
import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Enable caching headers and CORS for local testing
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        super().end_headers()

def main():
    os.chdir(DIRECTORY)
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        url = f"http://localhost:{PORT}"
        print("=" * 70)
        print(" DIGITAL CLIMATE CHANGE MONITORING: TRACKING TEMPERATURE AND RAINFALL TRENDS")
        print(" College Environmental Studies CA Project")
        print("=" * 70)
        print(f" Local Web Server Running at: {url}")
        print(" Press Ctrl+C to stop the server.")
        print("=" * 70)
        
        # Try opening browser automatically if interactive
        try:
            webbrowser.open(url)
        except Exception:
            pass

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
            sys.exit(0)

if __name__ == '__main__':
    main()
