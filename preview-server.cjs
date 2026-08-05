// Simple Node static file server
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4324;
const ROOT = 'C:\\Users\\Admin\\WorkBuddy\\2026-07-29-15-15-04\\luneaster-travel\\dist';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  let urlPath = req.url === '/' ? '/index.html' : req.url;
  let filePath = path.join(ROOT, urlPath);
  const ext = path.extname(filePath);

  // 自动处理目录/无扩展名路径 → 追加 index.html
  if (!ext) {
    filePath = path.join(filePath, 'index.html');
  }

  // Security: prevent path traversal
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const resolvedExt = path.extname(filePath).toLowerCase();
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found: ' + filePath);
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME[resolvedExt] || 'application/octet-stream',
      'Content-Length': data.length,
    });
    res.end(data);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Static server running at http://localhost:${PORT}`);
  console.log(`Serving from: ${ROOT}`);
});
