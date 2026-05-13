const defaultMimeByExtension = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

const getMimeType = (pathname) => {
  const match = pathname.match(/(\.[^./]+)$/);
  return match ? defaultMimeByExtension[match[1].toLowerCase()] : undefined;
};

const normalizePath = (pathname) => {
  if (pathname === '/' || pathname === '') return 'index.html';
  return pathname.replace(/^\//, '');
};

const findAssetKey = (pathname, manifest) => {
  const normalized = normalizePath(pathname);
  if (manifest[normalized]) return normalized;

  const indexPath = `${normalized.replace(/\/$/, '')}/index.html`;
  if (manifest[indexPath]) return indexPath;

  if (manifest['index.html']) return 'index.html';
  return null;
};

export default {
  async fetch(request, env, ctx) {
    const manifest = JSON.parse(env.__STATIC_CONTENT_MANIFEST || '{}');
    const assetKey = findAssetKey(new URL(request.url).pathname, manifest);

    if (!assetKey) {
      return new Response('Not found', { status: 404 });
    }

    const body = await env.__STATIC_CONTENT.get(assetKey, 'arrayBuffer');

    if (!body) {
      return new Response('Not found', { status: 404 });
    }

    const mimeType = getMimeType(assetKey) || 'application/octet-stream';
    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
      },
    });
  },
};
