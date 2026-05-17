import { spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const certPath = path.join(__dirname, 'server.crt')
const keyPath = path.join(__dirname, 'server.key')

// Check if certificates already exist
if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
  console.log('✓ SSL certificates already exist')
  process.exit(0)
}

console.log('🔐 Generating self-signed SSL certificates for development...')

try {
  // Use OpenSSL to generate self-signed certificate
  // Command: openssl req -nodes -new -x509 -keyout server.key -out server.crt -days 365 -subj "/CN=localhost"
  
  const result = spawnSync('openssl', [
    'req',
    '-nodes',
    '-new',
    '-x509',
    '-keyout', keyPath,
    '-out', certPath,
    '-days', '365',
    '-subj', '/CN=localhost'
  ], {
    cwd: __dirname,
    stdio: 'pipe'
  })

  if (result.error) {
    throw new Error(`OpenSSL not found or failed: ${result.error.message}\n\nPlease install OpenSSL or use Node.js packages like 'selfsigned' for certificate generation.`)
  }

  if (result.status === 0) {
    console.log('✅ Certificates generated successfully!')
    console.log(`📝 Private Key: ${keyPath}`)
    console.log(`📜 Certificate: ${certPath}`)
    console.log('\n⚠️  IMPORTANT: These are self-signed certificates for DEVELOPMENT ONLY!')
    console.log('🔒 For PRODUCTION: Use proper SSL certificates from a Certificate Authority (Let\'s Encrypt, etc.)')
    console.log('\n📌 To use in your code:')
    console.log('   import fs from "fs"')
    console.log('   const https = require("https")')
    console.log('   const options = {')
    console.log('     key: fs.readFileSync("./server.key"),')
    console.log('     cert: fs.readFileSync("./server.crt")')
    console.log('   }')
    console.log('   https.createServer(options, app).listen(3000)')
    process.exit(0)
  } else {
    throw new Error(`Certificate generation failed with code ${result.status}`)
  }

} catch (error) {
  console.error('❌ Error generating certificates:', error.message)
  console.log('\n📌 Alternative: Use Node.js package "selfsigned"')
  console.log('   npm install selfsigned')
  console.log('   npx node -e "const selfsigned = require(\'selfsigned\'); const pem = selfsigned.generate([{name:\'commonName\',value:\'localhost\'}]); require(\'fs\').writeFileSync(\'server.key\', pem.private); require(\'fs\').writeFileSync(\'server.crt\', pem.cert);"')
  process.exit(1)
}
