const {alerts} = require('../shared/alert.shared')
const {default_url} = require('../shared/window.shared')
const WindowService = require('../services/window.service')
const userModule = require('../shared/auth.shared')

class SocketService {
  
  constructor(socket) {
    this.socket = socket
  }

  openWebSocketConnection() {
    console.log('Conexão estabelecida');
    this.socket.send('Olá, servidor WebSocket!');
  }

  messageProcess(event, alertService) { 
    if (userModule.user) {
      const objeto = event.data 
      const {tipo, dataSet} = alertService.returnAlertInfo(objeto)
      const objetoProcessado = {
          id: alerts && alerts.length > 0 ? ( alerts.sort((a,b) => b.id - a.id)[0].id + 1 ): 1,
          dados: dataSet,
          tipo: tipo
      }
      
      alerts.push(objetoProcessado)
      alertService.preenchePreview(objetoProcessado)
      WindowService.displayAllScreens('/alert-list')
    }
    
  }

}
 
module.exports = {SocketService}