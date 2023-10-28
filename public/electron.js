const { app } = require('electron')
const WebSocket = require('ws') 
const {ElectronHandlerLoader} = require('./electron/handlers/electron.handler')
const {SocketHandlerLoader} = require('./electron/handlers/socket.handler')
const WindowService = require('./electron/services/window.service')  
const path = require('path');


setTimeout(() => {
  app.whenReady().then(() => { 
    console.log('iniciando') 
    WindowService.createWindow('')
  })
  
  function socketConnect() {
    console.log('tentando conectar')
    const ws = new WebSocket('wss://segpub.inteli.city/api/node/ws/alertapp')
    SocketHandlerLoader.init(ws, socketConnect)
  }
   
  
  socketConnect()
  ElectronHandlerLoader.init()
}, 2000)
