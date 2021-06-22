import * as Electron from "electron";
const { UIUrl } = require('../../bridge/ui');
const { ElectronService } = require('../../bridge/services');
let mainWindow: Electron.BrowserWindow;
console.log(UIUrl);
async function createWindow() {
    mainWindow = new Electron.BrowserWindow({
        width: 1600,
        height: 900,
        minHeight: 800,
        minWidth: 1200,
        title: 'Electron App',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    })
    mainWindow.setMenu(null);
    mainWindow.loadURL(UIUrl);
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => {
        mainWindow = null;
    })
}
ElectronService.connect(Electron);

Electron.app.on('ready', createWindow)
Electron.app.on('window-all-closed', () => process.platform !== 'darwin' && Electron.app.quit())
Electron.app.on('activate', () => { mainWindow === null && createWindow() })


