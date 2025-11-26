import manifestJSON from '__STATIC_CONTENT_MANIFEST';

const manifest = JSON.parse(manifestJSON);

const mimeTypes = {
  '.html': 'text/html; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=UTF-8',
};

function getAssetKey(pathname) {
  if (!pathname || pathname === '/') {
    return manifest['index.html'];
  }

  const trimmed = pathname.replace(/^\/+/, '');
  return manifest[trimmed] || manifest[`/${trimmed}`] || manifest['index.html'];
}

function getContentType(pathname) {
  const match = /\.[^.]+$/.exec(pathname || '');
  if (!match) return mimeTypes['.html'];
  return mimeTypes[match[0]] || 'application/octet-stream';
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const assetKey = getAssetKey(url.pathname);

    if (!assetKey) {
      return new Response('Not found', { status: 404 });
    }

    const asset = await env.__STATIC_CONTENT.get(assetKey, { type: 'arrayBuffer' });

    if (!asset) {
      return new Response('Not found', { status: 404 });
    }

    const headers = new Headers();
    headers.set('Content-Type', getContentType(url.pathname));

    return new Response(asset, { headers });
  },
};
