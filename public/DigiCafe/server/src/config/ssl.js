import https from 'https'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const certPath = path.join(__dirname, '..', '..', 'server.crt')
const keyPath = path.join(__dirname, '..', '..', 'server.key')

// Generate self-signed certificate if it doesn't exist
export function ensureCertificates() {
  if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
    console.log('✓ SSL certificates found')
    return { cert: certPath, key: keyPath }
  }

  console.log('⚠️  SSL certificates not found')
  console.log('📝 To enable HTTPS/WSS in production:')
  console.log('   Windows: Install mkcert or use PowerShell New-SelfSignedCertificate')
  console.log('   Linux/Mac: openssl req -x509 -newkey rsa:2048 -keyout server.key -out server.crt -days 365 -nodes -subj "/CN=localhost"')
  console.log('')
  console.log('📝 Or obtain certificates from Let\'s Encrypt / other CA')
  console.log('🔗 https://letsencrypt.org/')
  console.log('')
  return null
}

// Get HTTPS options if certificates exist
export function getHttpsOptions() {
  try {
    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
      return {
        cert: fs.readFileSync(certPath),
        key: fs.readFileSync(keyPath)
      }
    }
  } catch (error) {
    console.error('Error reading certificates:', error.message)
  }
  return null
}

// Create HTTP or HTTPS server based on certificate availability
export function createSecureServer(app) {
  const httpsOptions = getHttpsOptions()
  
  if (httpsOptions) {
    console.log('🔒 Using HTTPS (WSS enabled)')
    return https.createServer(httpsOptions, app)
  } else {
    console.log('⚠️  Using HTTP (WS only - development mode)')
    console.log('   For production, generate SSL certificates')
    return http.createServer(app)
  }
}
