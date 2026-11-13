import { createReadStream } from 'node:fs';
import { realpath, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = await realpath(path.dirname(fileURLToPath(import.meta.url)));
const port = Number(process.env.PORT || 4173);
const host = '127.0.0.1';
const shouldOpenBrowser = process.argv.includes('--open');

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  console.error('PORT must be an integer between 1 and 65535.');
  process.exit(1);
}

const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.mjs', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.gif', 'image/gif'],
  ['.ico', 'image/x-icon'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.ttf', 'font/ttf'],
  ['.mp3', 'audio/mpeg'],
  ['.ogg', 'audio/ogg'],
  ['.wav', 'audio/wav'],
]);

function isPublicPath(relativePath) {
  const parts = relativePath.split('/');
  if (parts.some((part) => !part || part.startsWith('.') || part.includes(':'))) return false;
  if (relativePath === 'index.html') return true;
  return parts.length > 1 && (parts[0] === 'src' || parts[0] === 'assets');
}

function respond(request, response, statusCode, message, extraHeaders = {}) {
  const body = `${message}\n`;
  response.writeHead(statusCode, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...extraHeaders,
  });
  response.end(request.method === 'HEAD' ? undefined : body);
}

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    respond(request, response, 405, 'Method not allowed', { Allow: 'GET, HEAD' });
    return;
  }

  let pathname;
  try {
    const target = request.url || '/';
    if (!target.startsWith('/') || target.startsWith('//')) throw new Error('Invalid target');
    pathname = decodeURIComponent(target.split('?')[0]);
  } catch {
    respond(request, response, 400, 'Invalid URL');
    return;
  }

  const relativePath = pathname === '/' ? 'index.html' : pathname.slice(1);
  if (/[\\\0]/u.test(relativePath) || !isPublicPath(relativePath)) {
    respond(request, response, 404, 'Not found');
    return;
  }

  try {
    const actualPath = await realpath(path.join(root, relativePath));
    const actualRelativePath = path.relative(root, actualPath).split(path.sep).join('/');
    // Symlinks must also resolve to a permitted public file inside this project.
    if (!isPublicPath(actualRelativePath) || path.isAbsolute(actualRelativePath)) {
      respond(request, response, 404, 'Not found');
      return;
    }

    const fileStat = await stat(actualPath);
    const mimeType = mimeTypes.get(path.extname(actualPath).toLowerCase());
    if (!fileStat.isFile() || !mimeType) {
      respond(request, response, 404, 'Not found');
      return;
    }

    response.writeHead(200, {
      'Content-Type': mimeType,
      'Content-Length': fileStat.size,
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    });
    if (request.method === 'HEAD') {
      response.end();
      return;
    }
    const stream = createReadStream(actualPath);
    stream.on('error', () => response.destroy());
    response.on('close', () => stream.destroy());
    stream.pipe(response);
  } catch (error) {
    if (error.code === 'ENOENT' || error.code === 'ENOTDIR' || error.code === 'EACCES') {
      respond(request, response, 404, 'Not found');
      return;
    }
    console.error('Could not serve request:', error.message);
    respond(request, response, 500, 'Internal server error');
  }
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. If the game is already running, open http://${host}:${port}/`);
  } else {
    console.error(error.message);
  }
  process.exitCode = 1;
});

server.listen(port, host, () => {
  const url = `http://${host}:${port}/`;
  console.log(`Game server: ${url}`);
  console.log('Keep this window open while playing. Press Ctrl+C to stop.');
  if (shouldOpenBrowser) {
    const command = process.platform === 'win32' ? 'rundll32.exe' : process.platform === 'darwin' ? 'open' : 'xdg-open';
    const args = process.platform === 'win32' ? ['url.dll,FileProtocolHandler', url] : [url];
    const browser = spawn(command, args, { detached: true, stdio: 'ignore', windowsHide: true });
    browser.on('error', () => console.error(`Open your browser at ${url}`));
    browser.unref();
  }
});
