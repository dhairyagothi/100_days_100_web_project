const assert = require('node:assert/strict');
const { test } = require('node:test');

process.env.MAIL_RATE_LIMIT_MAX_REQUESTS = '2';
process.env.MAIL_RATE_LIMIT_WINDOW_MS = '60000';
process.env.REQUEST_BODY_LIMIT = '1kb';

const {
  escapeHtml,
  handleRequestErrors,
  rateLimitMailRequests,
  validateSubscriber,
} = require('./app');

function createResponse() {
  return {
    body: '',
    headers: {},
    statusCode: 200,
    send(body) {
      this.body = body;
      return this;
    },
    set(name, value) {
      this.headers[name] = value;
      return this;
    },
    status(statusCode) {
      this.statusCode = statusCode;
      return this;
    },
  };
}

test('validates a single subscriber address and bounded name', () => {
  assert.deepEqual(validateSubscriber({ name: ' Alex ', emailid: 'alex@example.com' }), {
    name: 'Alex',
    email: 'alex@example.com',
  });
  assert.equal(
    validateSubscriber({ name: 'Alex', emailid: 'alex@example.com,other@example.com' }).error,
    'Enter one valid email address.',
  );
  assert.equal(
    validateSubscriber({ name: 'Alex', emailid: '.alex@example.com' }).error,
    'Enter one valid email address.',
  );
  assert.match(validateSubscriber({ name: '\n', emailid: 'alex@example.com' }).error, /^Name must/);
});

test('escapes subscriber names before HTML rendering', () => {
  assert.equal(
    escapeHtml(`<img src="x">'&`),
    '&lt;img src=&quot;x&quot;&gt;&#39;&amp;',
  );
});

test('limits excessive mail requests by client address', () => {
  const request = { ip: 'test-client' };
  let nextCalls = 0;

  rateLimitMailRequests(request, createResponse(), () => {
    nextCalls += 1;
  });
  rateLimitMailRequests(request, createResponse(), () => {
    nextCalls += 1;
  });

  const limitedResponse = createResponse();
  rateLimitMailRequests(request, limitedResponse, () => {
    nextCalls += 1;
  });

  assert.equal(nextCalls, 2);
  assert.equal(limitedResponse.statusCode, 429);
  assert.ok(limitedResponse.headers['Retry-After']);
});

test('returns clear parser error responses', () => {
  const oversizedResponse = createResponse();
  handleRequestErrors(
    { type: 'entity.too.large' },
    {},
    oversizedResponse,
    assert.fail,
  );
  assert.equal(oversizedResponse.statusCode, 413);
  assert.equal(oversizedResponse.body, 'Request body is too large.');

  const malformedResponse = createResponse();
  const malformedError = new SyntaxError('Invalid JSON');
  malformedError.body = '{broken';
  handleRequestErrors(malformedError, {}, malformedResponse, assert.fail);
  assert.equal(malformedResponse.statusCode, 400);
  assert.equal(malformedResponse.body, 'Invalid JSON request body.');
});
