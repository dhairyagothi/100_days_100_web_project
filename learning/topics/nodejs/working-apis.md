# Working with APIs

Modern applications rarely work in isolation. They integrate with external APIs to fetch data, perform actions, or leverage third-party services. This lesson covers how to work with HTTP APIs in Node.js, making requests, handling responses, and managing errors.

---

## 1. What is an API?

An **API** (Application Programming Interface) is a contract that allows different applications to communicate. An **HTTP API** uses HTTP methods (GET, POST, etc.) over the internet.

### Types of APIs

| Type | Purpose |
| :--- | :--- |
| **REST API** | Uses HTTP methods to perform CRUD operations |
| **GraphQL API** | Queries data with flexible field selection |
| **Webhook** | Server pushes data to your endpoint |
| **Real-time API** | WebSocket-based instant communication |

---

## 2. Making HTTP Requests in Node.js

### Using the Built-in http Module

```javascript
const http = require('http');

const options = {
  hostname: 'api.example.com',
  path: '/data',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Response:', data);
  });
});

req.on('error', (err) => {
  console.error('Error:', err);
});

req.end();
```

### Using the https Module (Recommended)

```javascript
const https = require('https');

const options = {
  hostname: 'api.example.com',
  path: '/data',
  method: 'GET',
  headers: {
    'User-Agent': 'Node.js Client'
  }
};

const req = https.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Response:', JSON.parse(data));
  });
});

req.on('error', err => console.error('Error:', err));
req.end();
```

---

## 3. Using fetch() (Modern Approach)

Node.js 18+ includes the Fetch API natively:

```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.error('Error:', err);
  }
}

fetchData();
```

---

## 4. Popular HTTP Libraries

### axios (Most Popular)

```bash
npm install axios
```

```javascript
const axios = require('axios');

// GET request
axios.get('https://api.example.com/users')
  .then(response => console.log(response.data))
  .catch(error => console.error(error));

// POST request
axios.post('https://api.example.com/users', {
  name: 'John',
  email: 'john@example.com'
})
  .then(response => console.log(response.data))
  .catch(error => console.error(error));
```

### Using async/await with axios

```javascript
const axios = require('axios');

async function getUsers() {
  try {
    const response = await axios.get('https://api.example.com/users');
    console.log(response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getUsers();
```

---

## 5. API Request Workflow

<div class="vector-flowchart">
  <svg viewBox="0 0 700 350" width="100%">
    <!-- Title -->
    <text x="350" y="25" text-anchor="middle" class="svg-text svg-text-heading" style="font-size: 18px; font-weight: 600;">API Request & Response Flow</text>
    
    <!-- Start -->
    <circle cx="350" cy="60" r="18" class="svg-node"/>
    <text x="350" y="65" text-anchor="middle" class="svg-text" style="font-size: 12px; fill: white; font-weight: bold;">START</text>
    
    <!-- Arrow -->
    <path d="M 350 78 L 350 108" class="svg-line"/>
    <polygon points="350,108 346,102 354,102" class="svg-marker"/>
    
    <!-- Build Request -->
    <rect x="240" y="108" width="220" height="60" rx="6" class="svg-node"/>
    <text x="350" y="128" text-anchor="middle" class="svg-text svg-text-heading">1. Build Request</text>
    <text x="350" y="148" text-anchor="middle" class="svg-text" style="font-size: 12px;">URL, headers, method, body</text>
    
    <!-- Arrow -->
    <path d="M 350 168 L 350 198" class="svg-line"/>
    <polygon points="350,198 346,192 354,192" class="svg-marker"/>
    
    <!-- Send Request -->
    <rect x="240" y="198" width="220" height="60" rx="6" class="svg-node" style="fill: rgba(59, 130, 246, 0.1);"/>
    <text x="350" y="218" text-anchor="middle" class="svg-text svg-text-heading">2. Send Request</text>
    <text x="350" y="238" text-anchor="middle" class="svg-text" style="font-size: 12px;">HTTP transmission over network</text>
    
    <!-- Arrow -->
    <path d="M 350 258 L 350 288" class="svg-line"/>
    <polygon points="350,288 346,282 354,282" class="svg-marker"/>
    
    <!-- Wait for Response -->
    <rect x="240" y="288" width="220" height="60" rx="6" class="svg-node" style="fill: rgba(16, 185, 129, 0.1);"/>
    <text x="350" y="308" text-anchor="middle" class="svg-text svg-text-heading">3. Wait for Response</text>
    <text x="350" y="328" text-anchor="middle" class="svg-text" style="font-size: 12px;">Status code, headers, body</text>
    
    <!-- Bottom: Error & Success Paths -->
    <rect x="30" y="50" width="110" height="80" rx="6" style="fill: rgba(239, 68, 68, 0.1); border: 1px solid #ef4444;"/>
    <text x="85" y="70" text-anchor="middle" class="svg-text svg-text-heading" style="font-size: 12px;">Error Path</text>
    <text x="85" y="88" text-anchor="middle" class="svg-text" style="font-size: 10px;">Network error</text>
    <text x="85" y="100" text-anchor="middle" class="svg-text" style="font-size: 10px;">Timeout</text>
    <text x="85" y="112" text-anchor="middle" class="svg-text" style="font-size: 10px;">Invalid response</text>
    
    <rect x="560" y="50" width="110" height="80" rx="6" style="fill: rgba(16, 185, 129, 0.1); border: 1px solid #10b981;"/>
    <text x="615" y="70" text-anchor="middle" class="svg-text svg-text-heading" style="font-size: 12px;">Success Path</text>
    <text x="615" y="88" text-anchor="middle" class="svg-text" style="font-size: 10px;">Parse JSON</text>
    <text x="615" y="100" text-anchor="middle" class="svg-text" style="font-size: 10px;">Use data</text>
    <text x="615" y="112" text-anchor="middle" class="svg-text" style="font-size: 10px;">Process results</text>
  </svg>
</div>

---

## 6. Handling Different Response Types

### JSON Response

```javascript
const https = require('https');

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

fetchJSON('https://api.example.com/users')
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

### HTML Response

```javascript
const https = require('https');

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => resolve(html));
    }).on('error', reject);
  });
}

fetchHTML('https://example.com')
  .then(html => console.log(html.length, 'characters'))
  .catch(err => console.error(err));
```

---

## 7. HTTP Status Codes and Error Handling

### Checking Status Codes

```javascript
const https = require('https');

https.get('https://api.example.com/users', (res) => {
  console.log('Status:', res.statusCode);
  
  if (res.statusCode === 200) {
    console.log('Success!');
  } else if (res.statusCode === 404) {
    console.log('Resource not found');
  } else if (res.statusCode === 500) {
    console.log('Server error');
  } else {
    console.log('Unexpected status:', res.statusCode);
  }
}).on('error', (err) => {
  console.error('Request error:', err);
});
```

---

## 8. Real-World Example: Weather API

<div class="example-output-container">
  <div class="example-output-header">
    <i class="fas fa-code"></i> Fetch Weather Data from Public API
  </div>
  <div class="example-output-preview">
    <div style="background: var(--bg-surface); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--border); font-family: 'JetBrains Mono', monospace; font-size: 11px; max-height: 400px; overflow-y: auto;">

```javascript
// weather.js - Using free weather API
const https = require('https');

async function getWeather(city) {
  return new Promise((resolve, reject) => {
    const url = `https://api.weatherapi.com/v1/current.json?key=demo&q=${city}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const weather = JSON.parse(data);
          
          if (res.statusCode === 200) {
            resolve({
              city: weather.location.name,
              country: weather.location.country,
              temperature: weather.current.temp_c,
              condition: weather.current.condition.text,
              humidity: weather.current.humidity,
              windSpeed: weather.current.wind_kph
            });
          } else {
            reject(new Error(weather.error.message));
          }
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  try {
    const weather = await getWeather('London');
    console.log('Weather Information:');
    console.log(`City: ${weather.city}, ${weather.country}`);
    console.log(`Temperature: ${weather.temperature}°C`);
    console.log(`Condition: ${weather.condition}`);
    console.log(`Humidity: ${weather.humidity}%`);
    console.log(`Wind Speed: ${weather.windSpeed} km/h`);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
```

    </div>
  </div>
</div>

---

## 9. Authentication (API Keys and Tokens)

### Using API Keys

```javascript
const axios = require('axios');

const apiKey = 'your-api-key-here';

async function fetchWithAuth() {
  try {
    const response = await axios.get(
      'https://api.example.com/data',
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );
    console.log(response.data);
  } catch (err) {
    console.error('Error:', err);
  }
}

fetchWithAuth();
```

### Using OAuth (Token-based)

```javascript
const axios = require('axios');

async function getAccessToken(clientId, clientSecret) {
  try {
    const response = await axios.post(
      'https://auth.example.com/oauth/token',
      {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }
    );
    return response.data.access_token;
  } catch (err) {
    console.error('Auth error:', err);
  }
}

async function fetchWithOAuth() {
  const token = await getAccessToken('id', 'secret');
  
  const response = await axios.get(
    'https://api.example.com/protected',
    {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  console.log(response.data);
}

fetchWithOAuth();
```

---

## 10. Rate Limiting and Retry Logic

### Implementing Retry Logic

```javascript
const axios = require('axios');

async function fetchWithRetry(url, maxRetries = 3) {
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (err) {
      attempt++;
      
      if (err.response?.status === 429) {
        // Too many requests - wait before retry
        const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Rate limited. Waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else if (attempt >= maxRetries) {
        throw err;
      } else {
        console.log(`Attempt ${attempt} failed, retrying...`);
      }
    }
  }
}

fetchWithRetry('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(err => console.error('Failed after retries:', err));
```

---

## 11. Best Practices

<div class="practices-grid">
  <div class="practice-card best-practices">
    <h4><i class="fas fa-check-circle"></i> Best Practices</h4>
    <ul>
      <li>Always use HTTPS for security</li>
      <li>Handle errors gracefully</li>
      <li>Set timeouts for requests</li>
      <li>Implement retry logic with backoff</li>
      <li>Validate and sanitize responses</li>
      <li>Use environment variables for API keys</li>
      <li>Cache responses when appropriate</li>
      <li>Log requests for debugging</li>
    </ul>
  </div>
  
  <div class="practice-card common-mistakes">
    <h4><i class="fas fa-times-circle"></i> Common Mistakes</h4>
    <ul>
      <li>Hardcoding API keys in code</li>
      <li>Not handling connection errors</li>
      <li>Assuming responses are always valid</li>
      <li>Ignoring rate limits</li>
      <li>Not setting request timeouts</li>
      <li>Exposing sensitive data in logs</li>
      <li>Blocking requests without timeout</li>
    </ul>
  </div>
</div>

---

> [!TIP]
> **Pro Tip**: Use `dotenv` to manage API keys securely:
> ```bash
> npm install dotenv
> ```
> ```javascript
> require('dotenv').config();
> const apiKey = process.env.API_KEY;
> ```

---

## 12. Coding Exercise: Build a GitHub User Fetcher

### Task:

Create a Node.js app that fetches GitHub user information and repositories using the GitHub API.

##### Solution

```bash
npm install axios dotenv
```

```javascript
// github-fetcher.js
const axios = require('axios');
require('dotenv').config();

const github = axios.create({
  baseURL: 'https://api.github.com',
  headers: {
    'Authorization': `token ${process.env.GITHUB_TOKEN}`
  }
});

async function getUser(username) {
  try {
    const response = await github.get(`/users/${username}`);
    return response.data;
  } catch (err) {
    console.error(`Error fetching user ${username}:`, err.message);
  }
}

async function getRepos(username) {
  try {
    const response = await github.get(`/users/${username}/repos`);
    return response.data;
  } catch (err) {
    console.error(`Error fetching repos:`, err.message);
  }
}

async function main() {
  const username = 'torvalds';
  
  const user = await getUser(username);
  console.log(`User: ${user.name}`);
  console.log(`Bio: ${user.bio}`);
  console.log(`Followers: ${user.followers}`);
  
  const repos = await getRepos(username);
  console.log(`\nTop 5 repositories:`);
  repos.slice(0, 5).forEach(repo => {
    console.log(`- ${repo.name}: ${repo.description}`);
  });
}

main();
```

---

## Summary

Working with APIs is essential in modern Node.js development. Whether fetching data, integrating third-party services, or building microservices, mastering API communication is crucial. In the next lesson, you'll learn about environment variables, a critical practice for managing configuration and secrets securely.
