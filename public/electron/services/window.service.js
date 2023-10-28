const { app, BrowserWindow, screen, Menu  } = require('electron')
const {windows, window_default_height, window_default_width} = require('../shared/window.shared')
const path = require('path')
const {default_url} = require('../shared/window.shared')
const { Howl, Howler } = require('howler');

class WindowService {

    createWindow = (url) => {
        console.log(path.join(__dirname, 'preload.js'))
        const win = new BrowserWindow({
          width: window_default_width,
          height: window_default_height,
          webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
          },
        })  
        Menu.setApplicationMenu(null)
      ///  win.loadURL(default_url + url) 
        win.loadURL('http://localhost:3001')
        windows.push(win)
        return 
    }

    displayAllScreens = (url) => {
      const displays = screen.getAllDisplays();
      const sound = new Howl({
        src: [path.join(__dirname, 'sounds/alert.mp3')]
      });
      
      displays.forEach((display) => {
      const { width, height } = display.workAreaSize;
      Menu.setApplicationMenu(null)
      const win = new BrowserWindow({
       width,
       height,
       webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
       x: display.bounds.x,
       y: display.bounds.y,
      });

      win.loadURL('http://localhost:3001/alert-list')
      sound.play()
      windows.push(win);

      win.on('closed', () => {
        // Remova a janela da lista quando ela for fechada pelo usuário
        const index = windows.indexOf(win);
        if (index > -1) {
         windows.splice(index, 1);
        }
       });
      });
    }

}

const singleton = new WindowService()
module.exports = singleton