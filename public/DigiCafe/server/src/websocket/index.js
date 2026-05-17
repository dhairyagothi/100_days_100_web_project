export function initializeWebSocket(server) {
  const WebSocket = (await import('ws')).WebSocketServer
  
  const wss = new WebSocket.Server({ server })

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected')

    ws.on('close', () => {
      console.log('WebSocket client disconnected')
    })

    ws.on('error', (error) => {
      console.error('WebSocket error:', error)
    })
  })

  return wss
}
