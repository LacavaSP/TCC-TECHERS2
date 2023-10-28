const { SocketService } = require('../services/socket.service'); 
const AlertService = require('../services/alert.service')
const {BrowserWindow} = require('electron')
class SocketHandlerLoader {
  
    static init(socket, socketConnect) {
        this.service = null
        this.alertService = null
        
        const criarConexao = (sct) => {
            if (!sct) {
                sct = socket
            }
            this.service = new SocketService(socket)
            this.alertService = new AlertService()
            socket.addEventListener('open', (event) => {
                this.service.openWebSocketConnection()
            });
        }
        
        criarConexao(null)
          

        socket.addEventListener('message', (event) => {
            BrowserWindow.getAllWindows().forEach( w => {
                if (w.webContents.getURL().indexOf('alert-list') !== -1) {
                    w.close()
                }
            })
            this.service.messageProcess(event, this.alertService)
        });

        socket.addEventListener('close', (event) => {
            console.log('desconectado')       
            setTimeout(socketConnect, 5000)
        });
    }
}


module.exports = {SocketHandlerLoader}