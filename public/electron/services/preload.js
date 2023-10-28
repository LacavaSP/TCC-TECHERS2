const { contextBridge, ipcRenderer } = require('electron')
console.log('O preload script está funcionando corretamente.');
contextBridge.exposeInMainWorld('electron', {
    sendData: (data) => ipcRenderer.invoke('alerta', data),
    fecharRenderizador: (index) => ipcRenderer.invoke('fecharRenderizador', index),
    obterDadosAlert: (id) => ipcRenderer.invoke('obterDadosAlert', id),
    receberDadosLogin : (loginData) => ipcRenderer.invoke('receberDadosLogin', loginData),
    alertRemove: (id) => ipcRenderer.invoke('alertRemove', id)
})