/* request.js — HTTP request sending, env variable substitution, and cURL utilities */

const RequestModule = (() => {

  /* Replace {{VAR}} placeholders with values from the active environment */
  function applyEnvVars(str) {
    const envs = Storage.getEnvironments();
    const activeId = Storage.getActiveEnv();
    if (!activeId) return str;
    const env = envs.find(e => e.id === activeId);
    if (!env) return str;
    return str.replace(/\{\{(\w+)\}\}/g, (_, key) => env.vars[key] !== undefined ? env.vars[key] : `{{${key}}}`);
  }

  /* Validate a URL string */
  function isValidUrl(url) {
    try { new URL(url); return true; } catch { return false; }
  }

  /* Format bytes into a human-readable string */
  function formatSize(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  /* Send an HTTP request and return a result object */
  async function sendRequest({ method, url, headers, body, bodyType }) {
    // Apply environment variable substitution
    url = applyEnvVars(url);

    if (!url) throw new Error('URL is required');
    if (!isValidUrl(url)) throw new Error(`Invalid URL: "${url}". Make sure to include the protocol (https://)`);

    const fetchOptions = { method, headers: {} };

    // Build headers map
    headers.forEach(({ key, value }) => {
      if (key.trim()) fetchOptions.headers[key.trim()] = applyEnvVars(value.trim());
    });

    // Attach body for non-GET/HEAD methods
    if (!['GET', 'HEAD'].includes(method) && bodyType !== 'none' && body.trim()) {
      if (bodyType === 'json') {
        try { JSON.parse(body); } catch (e) { throw new Error(`Invalid JSON body: ${e.message}`); }
        if (!fetchOptions.headers['Content-Type'] && !fetchOptions.headers['content-type']) {
          fetchOptions.headers['Content-Type'] = 'application/json';
        }
      }
      fetchOptions.body = body;
    }

    const startTime = performance.now();
    const response = await fetch(url, fetchOptions);
    const elapsed = Math.round(performance.now() - startTime);

    const rawText = await response.text();
    const size = new TextEncoder().encode(rawText).length;

    // Collect response headers
    const respHeaders = {};
    response.headers.forEach((val, key) => { respHeaders[key] = val; });

    // Try parsing as JSON
    let parsed = null;
    let isJson = false;
    const ct = (respHeaders['content-type'] || '').toLowerCase();
    if (ct.includes('json') || (rawText.trimStart().startsWith('{') || rawText.trimStart().startsWith('['))) {
      try { parsed = JSON.parse(rawText); isJson = true; } catch { /* not JSON */ }
    }

    return {
      status: response.status,
      statusText: response.statusText,
      time: elapsed,
      size: formatSize(size),
      rawText,
      parsed,
      isJson,
      headers: respHeaders,
      ok: response.ok,
    };
  }

  /* Generate a cURL command string from request config */
  function generateCurl({ method, url, headers, body, bodyType }) {
    url = applyEnvVars(url);
    if (!url) return '# No URL provided';

    let cmd = `curl -X ${method} \\\n  '${url}'`;

    headers.forEach(({ key, value }) => {
      if (key.trim()) {
        cmd += ` \\\n  -H '${key.trim()}: ${applyEnvVars(value.trim())}'`;
      }
    });

    if (!['GET', 'HEAD'].includes(method) && bodyType !== 'none' && body.trim()) {
      const escaped = body.replace(/'/g, "'\\''");
      cmd += ` \\\n  -d '${escaped}'`;
    }

    return cmd;
  }

  /* Parse a cURL command string and return a request config object */
  function parseCurl(curlStr) {
    const result = { method: 'GET', url: '', headers: [], body: '', bodyType: 'none' };

    // Normalize multi-line cURL
    const line = curlStr.replace(/\\\s*\n/g, ' ').replace(/\s+/g, ' ').trim();

    // Extract method
    const methodMatch = line.match(/-X\s+(\w+)/i);
    if (methodMatch) result.method = methodMatch[1].toUpperCase();

    // Extract URL — find the first https?:// or http:// token, or quoted string after 'curl'
    const urlMatch = line.match(/curl\s+(?:-[^\s]+\s+)*['"]?(https?:\/\/[^\s'"]+)['"]?/i)
                  || line.match(/['"]?(https?:\/\/[^\s'"]+)['"]?/i);
    if (urlMatch) result.url = urlMatch[1].replace(/^['"]|['"]$/g, '');

    // Extract headers (-H 'Key: Value')
    const headerRe = /-H\s+['"]([^'"]+)['"]/gi;
    let hm;
    while ((hm = headerRe.exec(line)) !== null) {
      const [key, ...rest] = hm[1].split(':');
      if (key) result.headers.push({ key: key.trim(), value: rest.join(':').trim() });
    }

    // Extract body data (-d or --data)
    const bodyMatch = line.match(/(?:-d|--data(?:-raw)?)\s+['"]([^'"]*)['"]/i)
                   || line.match(/(?:-d|--data(?:-raw)?)\s+(\S+)/i);
    if (bodyMatch) {
      result.body = bodyMatch[1];
      // Detect JSON
      try { JSON.parse(result.body); result.bodyType = 'json'; } catch { result.bodyType = 'text'; }
      if (!['GET', 'HEAD'].includes(result.method)) result.method = result.method === 'GET' ? 'POST' : result.method;
    }

    return result;
  }

  return { sendRequest, generateCurl, parseCurl, applyEnvVars, isValidUrl };
})();
