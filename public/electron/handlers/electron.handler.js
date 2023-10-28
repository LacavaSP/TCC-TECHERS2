const { ipcMain } = require('electron')
const alertModuleVariables = require('../shared/alert.shared')
const userModule = require('../shared/auth.shared')

class ElectronHandlerLoader {
    static async init (){
       
        ipcMain.handle('alerta', (event, args) => {
            return alertModuleVariables.alertList
        })
        
        ipcMain.handle('obterDadosAlert', (event, args) => { 
            return alertModuleVariables.alerts.filter(alert => alert.id === (parseInt(args, 0)))[0]
        })
        
        ipcMain.handle('fecharRenderizador', (event, args) => {
            windows[0].close()
        })
        
        ipcMain.handle('alertRemove', (event, args) => {
            alertModuleVariables.alertList = alertModuleVariables.alertList.filter(a => a.id !== parseInt(args, 0))
        })

        ipcMain.handle('receberDadosLogin', (event, args) => {  
            userModule.user = args
        })
    }
}

module.exports = { ElectronHandlerLoader }